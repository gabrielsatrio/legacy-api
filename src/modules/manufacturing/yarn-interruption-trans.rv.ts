import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { YarnInterruptionTrans } from './entities/yarn-interruption-trans';
import { YarnInterruptionTransInput } from './yarn-interruption-trans.in';

@Resolver(YarnInterruptionTrans)
export class YarnInterruptionTransResolver {
  @Query(() => [YarnInterruptionTrans], { nullable: true })
  @UseMiddleware(isAuth)
  async getYarnInterruptionTrans(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<YarnInterruptionTrans[] | undefined> {
    return await YarnInterruptionTrans.findBy({
      contract: In(contract)
    });
  }

  @Mutation(() => YarnInterruptionTrans)
  @UseMiddleware(isAuth)
  async createYarnInterruptionTrans(
    @Arg('input') input: YarnInterruptionTransInput
  ): Promise<YarnInterruptionTrans | undefined> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_YARN_INTERRUPTION_TRANS`;
      const result = await ifs.query(sql);
      const data = YarnInterruptionTrans.create({
        ...input,
        id: result[0].id
      });
      const results = await YarnInterruptionTrans.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => YarnInterruptionTrans, { nullable: true })
  @UseMiddleware(isAuth)
  async updateYarnInterruptionTrans(
    @Arg('input') input: YarnInterruptionTransInput
  ): Promise<YarnInterruptionTrans | null> {
    try {
      const yarnInterruptionTrans = await YarnInterruptionTrans.findOneBy({
        id: input.id
      });
      if (!yarnInterruptionTrans) throw new Error('No data found.');
      const sql = `BEGIN GBR_YARN_INTR_TRANS_API.Update_Yarn_Intr_Trans(:id, :contract, :machine, :interruptionId, :freq, :durationMinute, :reportDate, :outId); END;`;

      const result = await ifs.query(sql, [
        input.id,
        input.contract,
        input.machine,
        input.interruptionId,
        input.freq,
        input.durationMinute,
        input.reportDate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outId = result[0];
      const data = YarnInterruptionTrans.findOneBy({ id: outId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => YarnInterruptionTrans)
  @UseMiddleware(isAuth)
  async deleteYarnInterruptionTrans(
    @Arg('id') id: number
  ): Promise<YarnInterruptionTrans> {
    try {
      const data = await YarnInterruptionTrans.findOneBy({
        id: id
      });
      if (!data) throw new Error('No data found.');
      await YarnInterruptionTrans.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
