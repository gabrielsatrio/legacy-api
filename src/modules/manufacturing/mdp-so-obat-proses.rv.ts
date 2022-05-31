import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import moment from 'moment';
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
    const sql = `select ATJ_LOT_BATCH_API.generate(:p_order_no) as "department" from dual `;
    const username = await ifs.query(sql, [orderNo]);

    return username[0].department;
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
      :alternate,
      :note,
      :tipe,
      :mesin,
      :outOrderNo);
    END;
  `;

      const result = await ifs.query(sql, [
        input.contract,
        input.partNo,
        moment(input.needDate).format('MM/DD/YY'),
        input.qty,
        input.alternate,
        input.note,
        input.tipe,
        input.mesin,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outOrderNo = result[0] as string;

      const data = await SoObatProses.findOneBy({
        orderNo: outOrderNo
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
