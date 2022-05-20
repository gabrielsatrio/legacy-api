import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import moment from 'moment';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { SoObatProses } from './entities/mdp-so-obat-proses';
import { SoObatProsesInput } from './mdp-so-obat-proses.in';

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
