import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like } from 'typeorm';
import { OpnameStatus } from './entities/opname-status';
import { OpnameStatusInput } from './opname-status.in';

@Resolver(OpnameStatus)
export class OpnameStatusResolver {
  @Query(() => OpnameStatus, { nullable: true })
  @UseMiddleware(isAuth)
  async getOpname(@Arg('objId') objId: string): Promise<OpnameStatus | null> {
    try {
      return await OpnameStatus.findOneBy({ objId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => OpnameStatus, { nullable: true })
  @UseMiddleware(isAuth)
  async getOpnameStatus(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<Record<string, string | undefined>> {
    try {
      const sql = `SELECT GBR_STOCK_OPNAME_API.GET_STATUS(:contract, :username, :tanggal) as "status" FROM DUAL`;
      const result = await ifs.query(sql, [contract, username, tanggal]);
      const status = result[0].status;
      return { status };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => OpnameStatus, { nullable: true })
  @UseMiddleware(isAuth)
  async getOpnameType(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<Record<string, string | undefined>> {
    try {
      const sql = `SELECT GBR_STOCK_OPNAME_API.GET_OPNAME_TYPE(:contract, :username, :tanggal) as "opnameType" FROM DUAL`;
      const result = await ifs.query(sql, [contract, username, tanggal]);
      const opnameType = result[0].opnameType;
      return { opnameType };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => OpnameStatus, { nullable: true })
  @UseMiddleware(isAuth)
  async getOpnameNumOfLoc(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<Record<string, string | undefined>> {
    try {
      const sql = `SELECT GBR_STOCK_OPNAME_API.GET_NUM_OF_LOC(:contract, :username, :tanggal) as "numOfLoc" FROM DUAL`;
      const result = await ifs.query(sql, [contract, username, tanggal]);
      const numOfLoc = result[0].numOfLoc;
      return { numOfLoc };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => OpnameStatus, { nullable: true })
  @UseMiddleware(isAuth)
  async getOpnameLocation(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<Record<string, string | undefined>> {
    try {
      const sql = `SELECT GBR_STOCK_OPNAME_API.GET_LOCATION(:contract, :username, :tanggal) as "locationNo" FROM DUAL`;
      const result = await ifs.query(sql, [contract, username, tanggal]);
      const locationNo = result[0].locationNo;
      return { locationNo };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [OpnameStatus])
  @UseMiddleware(isAuth)
  async getOpnameByContractUsername(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('username') username: string
  ): Promise<OpnameStatus[] | undefined> {
    try {
      return await OpnameStatus.find({
        where: {
          contract: In(contract),
          username: username
        }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [OpnameStatus])
  @UseMiddleware(isAuth)
  async getOpnameByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<OpnameStatus[] | undefined> {
    try {
      return await OpnameStatus.find({
        where: {
          contract: In(contract),
          objId: Like('%')
        }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [OpnameStatus])
  @UseMiddleware(isAuth)
  async getOpnameByContractDept(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('dept') dept: string
  ): Promise<OpnameStatus[] | undefined> {
    try {
      return await OpnameStatus.find({
        where: {
          contract: In(contract),
          dept: Like(dept),
          objId: Like('%')
        }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number)
  @UseMiddleware(isAuth)
  async getExpectedPercentage(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('dept') dept: string,
    @Arg('location') location: string
  ): Promise<number> {
    try {
      const sql = `SELECT GBR_STOCK_OPNAME_API.GET_EXPECTED_PERCENTAGE(:contract, :username, :dept, :location) as "percentage" FROM DUAL`;
      const result = await ifs.query(sql, [contract, username, dept, location]);
      return result[0].percentage;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number)
  @UseMiddleware(isAuth)
  async getExpectedRoll(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('dept') dept: string,
    @Arg('location') location: string
  ): Promise<number> {
    try {
      const sql = `SELECT GBR_STOCK_OPNAME_API.GET_EXPECTED_ROLL(:contract, :username, :dept, :location) as "roll" FROM DUAL`;
      const result = await ifs.query(sql, [contract, username, dept, location]);
      return result[0].roll;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => OpnameStatus)
  @UseMiddleware(isAuth)
  async startOpname(
    @Arg('input') input: OpnameStatusInput
  ): Promise<OpnameStatus | null> {
    try {
      const sql = `BEGIN GBR_FREEZE_OPNAME_API.Freeze_WIP_Ezio(:objId, :contract, :username, :dept, :periode, :time, :opnameType, :numOfLocation, :locationNo, :outObjId); END;`;
      const result = await ifs.query(sql, [
        input.objId,
        input.contract,
        input.username,
        '',
        input.periode,
        input.time,
        input.opnameType,
        input.numOfLoc,
        input.locationNo,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outObjId = result[0] as string;

      const data = OpnameStatus.findOneBy({ objId: outObjId });
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
  ): Promise<OpnameStatus | null> {
    try {
      const sql = `BEGIN GBR_STOCK_OPNAME_API.FINISH_STOCK_OPNAME(:contract, :periode, :username, :outObjId); END;`;
      const result = await ifs.query(sql, [
        contract,
        periode,
        username,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);

      const outObjId = result[0] as string;
      const data = OpnameStatus.findOneBy({ objId: outObjId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
