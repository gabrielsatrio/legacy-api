import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { GisHeader } from './entities/gis-header';
import { GisHeaderView } from './entities/gis-header.vw';
import { GisHeaderInput } from './gis-header.in';

@Resolver(GisHeader)
export class GisHeaderResolver {
  @Query(() => GisHeaderView, { nullable: true })
  @UseMiddleware(isAuth)
  async getGisHeader(
    @Arg('inspectId') inspectId: number
  ): Promise<GisHeaderView | null> {
    try {
      return await GisHeaderView.findOneBy({ inspectId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [GisHeaderView], { nullable: true })
  @UseMiddleware(isAuth)
  async getGisHeaderByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<GisHeaderView[] | undefined> {
    try {
      return await GisHeaderView.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewInspectId(): Promise<number> {
    try {
      const sql = 'SELECT GBR_GIS_HEADER_SEQ.NEXTVAL AS "id" FROM DUAL';
      const result = await ifs.query(sql);
      return result[0].id;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getInspectIdByParam(
    @Arg('orderNo') orderNo: string,
    @Arg('contract') contract: string,
    @Arg('rollNo') rollNo: string,
    @Arg('lotBatchNo') lotBatchNo: string
  ): Promise<number> {
    try {
      const sql = `SELECT inspect_id as "inspectId"
      FROM   gbr_gis_header
      WHERE  nvl(order_no,'x') like :orderNo
      AND    contract = :contract
      AND    roll_no LIKE :rollNo
      AND    NVL(lot_batch_no, 'x') LIKE :lotBatchNo`;
      const result = await ifs.query(sql, [
        orderNo,
        contract,
        rollNo,
        lotBatchNo
      ]);
      return result[0].inspectId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewRollNo(@Arg('orderNo') orderNo: string): Promise<number> {
    try {
      const sql =
        'SELECT nvl(max(roll_no)+1,1) as "rollNo" from GBR_GIS_HEADER where order_no = :orderNo';
      const result = await ifs.query(sql, [orderNo]);
      return result[0].rollNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewRollNoByLotSementara(
    @Arg('lotBatchNo') lotBatchNo: string
  ): Promise<number> {
    try {
      const sql =
        'SELECT nvl(max(roll_no)+1,1) as "rollNo" from GBR_GIS_HEADER where lot_batch_no = :lotBatchNo';
      const result = await ifs.query(sql, [lotBatchNo]);
      return result[0].rollNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisHeader)
  @UseMiddleware(isAuth)
  async createGisHeader(
    @Arg('input') input: GisHeaderInput,
    @Ctx() { req }: Context
  ): Promise<GisHeader> {
    try {
      const data = GisHeader.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await GisHeader.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisHeader, { nullable: true })
  @UseMiddleware(isAuth)
  async updateGisHeader(
    @Arg('input') input: GisHeaderInput
  ): Promise<GisHeader | undefined> {
    try {
      const data = await GisHeader.findOneBy({
        inspectId: input.inspectId
      });
      if (!data) throw new Error('No data found.');
      GisHeader.merge(data, {
        ...input
      });
      const result = await GisHeader.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisHeader)
  @UseMiddleware(isAuth)
  async deleteGisHeader(
    @Arg('inspectId') inspectId: number
  ): Promise<GisHeader> {
    try {
      const data = await GisHeader.findOneBy({ inspectId });
      if (!data) throw new Error('No data found.');
      await GisHeader.delete({ inspectId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
