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
import { getConnection, In } from 'typeorm';
import { DailyReportDygInput } from './daily-report-dyg.in';
import { DailyReportDyg } from './entities/daily-report-dyg';
import { DDPBPO } from './entities/ddp-bpo';

@Resolver(DailyReportDyg)
export class DailyReportDygResolver {
  @Query(() => [DailyReportDyg], { nullable: true })
  @UseMiddleware(isAuth)
  async getDailyReportDyg(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<DailyReportDyg[] | undefined> {
    return await DailyReportDyg.find({
      contract: In(contract)
    });
  }

  @Query(() => DDPBPO, { nullable: true })
  @UseMiddleware(isAuth)
  async getBPOByLotCelup(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('lotCelup') lotCelup: string
  ): Promise<DDPBPO | undefined> {
    const data = await DDPBPO.findOne({
      relations: ['dyestuffsUses', 'auxiliariesUses'],
      where: {
        contract: In(contract),
        lotCelup
      }
    });

    if (!data) throw new Error('No data found.');

    return data;
  }

  @Mutation(() => DailyReportDyg)
  @UseMiddleware(isAuth)
  async createDailyReportDyg(
    @Arg('input') input: DailyReportDygInput
  ): Promise<DailyReportDyg | undefined> {
    try {
      const sql = `SELECT nvl(max(row_id)+1,1) as "id" from CHR_DAILY_REPORT_DYG`;
      const result = await getConnection().query(sql);

      const data = DailyReportDyg.create({
        ...input,
        rowId: result[0].id
      });
      const results = await DailyReportDyg.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DailyReportDyg, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDailyReportDyg(
    @Arg('input') input: DailyReportDygInput,
    @Arg('rowId', () => Int) rowId: number
  ): Promise<DailyReportDyg | undefined | number> {
    try {
      const data = await DailyReportDyg.findOne({
        contract: input.contract,
        rowId: rowId
      });
      if (!data) throw new Error('No data found.');
      DailyReportDyg.merge(data, input);
      const results = await DailyReportDyg.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DailyReportDyg)
  @UseMiddleware(isAuth)
  async deleteDailyReportDyg(
    @Arg('rowId', () => Int) rowId: number,
    @Arg('contract') contract: string
  ): Promise<DailyReportDyg> {
    try {
      const data = await DailyReportDyg.findOne({
        rowId,
        contract
      });
      if (!data) throw new Error('No data found.');
      await DailyReportDyg.delete({ rowId, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
