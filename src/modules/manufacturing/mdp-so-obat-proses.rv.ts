import config from '@/config/main';
import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { sendEmail } from '@/utils/send-email';
import dayjs from 'dayjs';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { SoObatProses } from './entities/mdp-so-obat-proses';
import { SoObatProsesInput } from './mdp-so-obat-proses.in';
import { SoObatProsesReceiveInput } from './mdp-so-obat-receive.in';

@Resolver(SoObatProses)
export class SoObatProsesResolver {
  @Query(() => [SoObatProses], { nullable: true })
  @UseMiddleware(isAuth)
  async getSoObatProses(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<SoObatProses[] | undefined> {
    return await SoObatProses.find({
      relations: { details: true },
      where: { contract: In(contract) }
    });
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getGenerateLot(
    @Arg('orderNo') orderNo: string
  ): Promise<string | undefined> {
    try {
      const sql = `select
      case when nvl(shop_ord_api.get_contract@ifs8agt(:p_order_no, '*', '*'),'AT')='AGT' then
      ATJ_LOT_BATCH_API.generate@ifs8agt(:p_order_no)
      else ATJ_LOT_BATCH_API.generate(:p_order_no)
      end as "lot" from dual
      `;
      const generate = await ifs.query(sql, [orderNo]);

      return generate[0].lot;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SoObatProses)
  @UseMiddleware(isAuth)
  async receiveSoObatProses(
    @Arg('input') input: SoObatProsesReceiveInput
  ): Promise<SoObatProses | null> {
    try {
      const sql = `
    BEGIN
    CHR_SO_OBAT_API.ISSUE_RECEIVE_SO(
      :orderNo,
      :qtyReceive,
      :lotReceive,
      :locationReceive,
      :lotSourceReceive);
    END;
  `;

      await ifs.query(sql, [
        input.orderNo,
        input.qtyReceive,
        input.lotReceive,
        input.locationReceive,
        input.lotSourceReceive
      ]);

      const data = await SoObatProses.findOneBy({
        orderNo: input.orderNo
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SoObatProses)
  @UseMiddleware(isAuth)
  async createSoObatProses(
    @Arg('input') input: SoObatProsesInput
  ): Promise<SoObatProses | null> {
    try {
      const sql = `
    BEGIN
    CHR_SO_OBAT_API.CREATE_ORDER_OBAT(
      :contract,
      :partNo,
      :needDate,
      :qty,
      :alternativeNo,
      :note,
      :tipe,
      :mesin,
      :outOrderNo,
      :drum,
      :qtyDrum);
    END;
  `;

      const result = await ifs.query(sql, [
        input.contract,
        input.partNo,
        dayjs(input.needDate).format('MM/DD/YY'),
        input.qty,
        input.alternativeNo,
        input.note,
        input.tipe,
        input.mesin,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        input.drum,
        input.qtyDrum
      ]);
      const outOrderNo = result[0] as string;

      const data = await SoObatProses.findOneBy({
        orderNo: outOrderNo
      });

      if (input.contract === 'AGT') {
        await sendEmail(
          `Deni Ramdani <deniramdani@agtex.co.id>` || '',
          [],
          [],
          `Approval Request for Order No ${outOrderNo}`,
          `<p>Dear Mr Deni Ramdani,</p>
          <p>A new order (No: ${outOrderNo}) has been submitted for your approval.</br>
          You can find all the details about this request by clicking <a href="${config.client.url}/m/017/apr"><b>here</b></a>.</br>
          Please confirm your approval.</p>`
        );
      }

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SoObatProses)
  @UseMiddleware(isAuth)
  async syncSOIfs(
    @Arg('orderNo') orderNo: string
  ): Promise<SoObatProses | null> {
    try {
      const sql = `
    BEGIN
    CHR_SO_OBAT_API.MIRROR_SO_FR_IFS(
      :orderNo);
    END;
  `;

      await ifs.query(sql, [orderNo]);

      const data = await SoObatProses.findOneBy({
        orderNo: orderNo
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SoObatProses)
  @UseMiddleware(isAuth)
  async deleteSoObatProses(
    @Arg('orderNo') orderNo: string
  ): Promise<SoObatProses | null> {
    try {
      const data = await SoObatProses.findOneBy({
        orderNo: orderNo
      });

      if (!data) throw new Error('No data found.');

      const sql = `
    BEGIN
    CHR_SO_OBAT_API.DELETE_ORDER_OBAT(
      :orderNo);
    END;
  `;

      await ifs.query(sql, [orderNo]);

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
