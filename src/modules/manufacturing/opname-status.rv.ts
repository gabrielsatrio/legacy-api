import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { mapError } from './../../utils/map-error';
import { OpnameStatus } from './entities/opname-status';

@Resolver(OpnameStatus)
export class OpnameStatusResolver {
  @Query(() => OpnameStatus, { nullable: true })
  @UseMiddleware(isAuth)
  async getOpnameStatus(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<any | undefined> {
    try {
      const sql = `SELECT GBR_STOCK_OPNAME_API.GET_STATUS(:contract, :username, :tanggal) status FROM DUAL`;
      const result = await getConnection().query(sql, [
        contract,
        username,
        tanggal
      ]);
      console.log(result[0].STATUS);
      const status = result[0].STATUS;
      return { status };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  async startOpname(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<any | undefined> {
    try {
      const sql = `BEGIN GBR_STOCK_OPNAME_API.START_STOCK_OPNAME(:contract, :username, :tanggal)`;
      const result = await getConnection().query(sql, [
        contract,
        username,
        tanggal
      ]);
      const status = result[0].STATUS;
      return { status };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  async finishOpname(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<any | undefined> {
    try {
      const sql = `BEGIN GBR_STOCK_OPNAME_API.FINISH_STOCK_OPNAME(:contract, :username, :tanggal)`;
      const result = await getConnection().query(sql, [
        contract,
        username,
        tanggal
      ]);
      const status = result[0].STATUS;
      return { status };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
