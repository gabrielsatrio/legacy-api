import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Expedition } from './entities/spt-expedition';
import { ExpeditionInput } from './spt-expedition.in';

@Resolver(Expedition)
export class ExpeditionResolver {
  @Query(() => [Expedition])
  @UseMiddleware(isAuth)
  async getAllExpeditions(): Promise<Expedition[] | undefined> {
    return await Expedition.find();
  }

  @Query(() => Expedition, { nullable: true })
  @UseMiddleware(isAuth)
  async getExpedition(
    @Arg('expeditionId') expeditionId: string
  ): Promise<Expedition | null> {
    return await Expedition.findOneBy({ expeditionId });
  }

  @Mutation(() => Expedition)
  @UseMiddleware(isAuth)
  async createExpedition(
    @Arg('input') input: ExpeditionInput
  ): Promise<Expedition | null> {
    try {
      const sql = `
    BEGIN
      GBR_SPT_API.Create_Expedition(:expeditionId, :expeditionName, :outExpeditionId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.expeditionId,
        input.expeditionName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outExpeditionId = result[0] as string;
      const data = Expedition.findOneBy({
        expeditionId: outExpeditionId
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Expedition, { nullable: true })
  @UseMiddleware(isAuth)
  async updateExpedition(
    @Arg('input') input: ExpeditionInput
  ): Promise<Expedition | null> {
    try {
      const expedition = await Expedition.findOneBy({
        expeditionId: input.expeditionId
      });
      if (!expedition) throw new Error('No data found.');
      const sql = `
    BEGIN
      GBR_SPT_API.UPDATE_EXPEDITION(:expeditionId, :expeditionName, :outExpeditionId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.expeditionId,
        input.expeditionName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outExpeditionId = result[0];
      const data = Expedition.findOneBy({
        expeditionId: outExpeditionId
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Expedition)
  @UseMiddleware(isAuth)
  async deleteExpedition(
    @Arg('expeditionId') expeditionId: string
  ): Promise<Expedition> {
    try {
      const expedition = await Expedition.findOneBy({
        expeditionId
      });
      if (!expedition) throw new Error('No data found.');
      await Expedition.delete({ expeditionId });
      return expedition;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
