import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { PPN } from './entities/spt-ppn';
import { PPNInput } from './spt-ppn.in';

@Resolver(PPN)
export class PPNResolver {
  @Query(() => [PPN])
  @UseMiddleware(isAuth)
  async getAllPPN(): Promise<PPN[] | undefined> {
    return await PPN.find();
  }

  @Query(() => PPN, { nullable: true })
  @UseMiddleware(isAuth)
  async getPPN(
    @Arg('expeditionId') expeditionId: string
  ): Promise<PPN | undefined> {
    return await PPN.findOne(expeditionId);
  }

  @Mutation(() => PPN)
  @UseMiddleware(isAuth)
  async createPPN(@Arg('input') input: PPNInput): Promise<PPN | undefined> {
    try {
      const sql = `
    BEGIN
      GBR_SPT_API.CREATE_PPN(:expeditionId, :ppn, :outExpeditionId);
    END;
  `;
      const result = await getConnection().query(sql, [
        input.expeditionId,
        input.ppn,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outExpeditionId = result[0] as string;
      const data = PPN.findOne({
        expeditionId: outExpeditionId
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PPN, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePPN(@Arg('input') input: PPNInput): Promise<PPN | undefined> {
    try {
      const ppn = await PPN.findOne({
        expeditionId: input.expeditionId
      });
      if (!ppn) {
        throw new Error('No data found.');
      }
      const sql = `
    BEGIN
      GBR_SPT_API.UPDATE_PPN(:expeditionId, :ppn,  :outExpeditionId);
    END;
  `;
      const result = await getConnection().query(sql, [
        input.expeditionId,
        input.ppn,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outExpeditionId = result[0];
      const data = PPN.findOne({
        expeditionId: outExpeditionId
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PPN)
  @UseMiddleware(isAuth)
  async deletePPN(@Arg('expeditionId') expeditionId: string): Promise<PPN> {
    try {
      const ppn = await PPN.findOne({
        expeditionId
      });
      if (!ppn) throw new Error('No data found.');
      await PPN.delete({ expeditionId });
      return ppn;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
