import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { SoObatReserve } from './entities/mdp-so-obat-reserve';

@Resolver(SoObatReserve)
export class SoObatReserveResolver {
  @Query(() => [SoObatReserve], { nullable: true })
  @UseMiddleware(isAuth)
  async getSOReserve(
    @Arg('orderNo')
    orderNo: string,
    @Arg('lineItemNo', () => Int)
    lineItemNo: number
  ): Promise<SoObatReserve[] | undefined> {
    return await SoObatReserve.find({
      where: { orderNo: orderNo, lineNo: lineItemNo }
    });
  }

  @Mutation(() => SoObatReserve)
  @UseMiddleware(isAuth)
  async createReserveMaterial(
    @Arg('contract') contract: string,
    @Arg('orderNo') orderNo: string,
    @Arg('lineNo', () => Int) lineNo: number,
    @Arg('lotBooking') lotBooking: string
  ): Promise<SoObatReserve | null> {
    try {
      const sql = `
    BEGIN
    CHR_SO_OBAT_API.reserve_material(
      :contract,
      :orderNo,
      :lineNo,
      :lotBooking);
    END;
  `;

      await ifs.query(sql, [contract, orderNo, lineNo, lotBooking]);

      const data = await SoObatReserve.findOneBy({
        orderNo: orderNo,
        lineNo: lineNo,
        lotBooking: lotBooking
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SoObatReserve)
  @UseMiddleware(isAuth)
  async deleteReserveMaterial(
    @Arg('contract') contract: string,
    @Arg('orderNo') orderNo: string,
    @Arg('lineNo', () => Int) lineNo: number,
    @Arg('lotBooking') lotBooking: string
  ): Promise<SoObatReserve | null> {
    try {
      const data = await SoObatReserve.findOneBy({
        orderNo: orderNo,
        lineNo: lineNo,
        lotBooking: lotBooking
      });

      if (!data) throw new Error('No data found.');

      const sql = `
    BEGIN
    CHR_SO_OBAT_API.unreserve_material(
      :contract,
      :orderNo,
      :lineNo,
      :lotBooking);
    END;
  `;

      await ifs.query(sql, [contract, orderNo, lineNo, lotBooking]);

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
