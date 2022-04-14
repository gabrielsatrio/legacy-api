import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
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
  async getPPN(@Arg('expeditionId') expeditionId: string): Promise<PPN | null> {
    return await PPN.findOneBy({ expeditionId });
  }

  @Mutation(() => PPN)
  @UseMiddleware(isAuth)
  async createPPN(@Arg('input') input: PPNInput): Promise<PPN | null> {
    try {
      const sql = `
    BEGIN
      GBR_SPT_API.CREATE_PPN(:expeditionId, :ppn, :outExpeditionId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.expeditionId,
        input.ppn,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outExpeditionId = result[0] as string;
      const data = PPN.findOneBy({
        expeditionId: outExpeditionId
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PPN, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePPN(@Arg('input') input: PPNInput): Promise<PPN | null> {
    try {
      const ppn = await PPN.findOneBy({
        expeditionId: input.expeditionId
      });
      if (!ppn) throw new Error('No data found.');
      const sql = `
    BEGIN
      GBR_SPT_API.UPDATE_PPN(:expeditionId, :ppn,  :outExpeditionId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.expeditionId,
        input.ppn,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outExpeditionId = result[0];
      const data = PPN.findOneBy({
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
      const ppn = await PPN.findOneBy({
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
