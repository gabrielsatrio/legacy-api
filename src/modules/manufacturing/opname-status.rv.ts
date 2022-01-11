import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { OpnameStatus } from './entities/opname-status';
import { OpnameStatusInput } from './opname-status.in';

@Resolver(OpnameStatus)
export class OpnameStatusResolver {
  @Query(() => OpnameStatus, { nullable: true })
  @UseMiddleware(isAuth)
  async getOpnameStatus(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<Record<string, string | undefined>> {
    try {
      const sql = `SELECT GBR_STOCK_OPNAME_API.GET_STATUS(:contract, :username, :tanggal) as "status" FROM DUAL`;
      const result = await getConnection().query(sql, [
        contract,
        username,
        tanggal
      ]);
      const status = result[0].status;
      return { status };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => OpnameStatus)
  @UseMiddleware(isAuth)
  async startOpname(
    @Arg('input') input: OpnameStatusInput
  ): Promise<OpnameStatus | undefined> {
    try {
      const sql = `BEGIN GBR_FREEZE_OPNAME_API.Freeze_WIP(:objId, :contract, :username, :dept, :periode, :time, :type, :numOfLocation, :locationNo, :outObjId); END;`;
      const result = await getConnection().query(sql, [
        input.objId,
        input.contract,
        input.username,
        '',
        input.periode,
        input.time,
        input.type,
        input.numOfLocation,
        input.locationNo,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outObjId = result[0] as string;

      const data = OpnameStatus.findOne(outObjId);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => OpnameStatus)
  @UseMiddleware(isAuth)
  async finishOpname(
    @Arg('contract') contract: string,
    @Arg('periode') periode: Date,
    @Arg('username') username: string
  ): Promise<Record<string, string | undefined>> {
    try {
      const sql = `BEGIN GBR_STOCK_OPNAME_API.FINISH_STOCK_OPNAME(:contract, :periode, :username); END;`;
      const result = await getConnection().query(sql, [
        contract,
        periode,
        username
      ]);
      const status = result[0].STATUS;
      return { status };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
