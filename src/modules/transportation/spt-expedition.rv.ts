import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
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
  ): Promise<Expedition | undefined> {
    return await Expedition.findOne(expeditionId);
  }

  @Mutation(() => Expedition)
  @UseMiddleware(isAuth)
  async createExpedition(
    @Arg('input') input: ExpeditionInput
  ): Promise<Expedition | undefined> {
    try {
      const sql = `
    BEGIN
      GBR_SPT_API.Create_Expedition(:expeditionId, :expeditionName, :outExpeditionId);
    END;
  `;
      const result = await getConnection().query(sql, [
        input.expeditionId,
        input.expeditionName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outExpeditionId = result[0] as string;
      const data = Expedition.findOne({
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
  ): Promise<Expedition | undefined> {
    try {
      const expedition = await Expedition.findOne({
        expeditionId: input.expeditionId
      });
      if (!expedition) throw new Error('No data found.');
      const sql = `
    BEGIN
      GBR_SPT_API.UPDATE_EXPEDITION(:expeditionId, :expeditionName, :outExpeditionId);
    END;
  `;
      const result = await getConnection().query(sql, [
        input.expeditionId,
        input.expeditionName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outExpeditionId = result[0];
      const data = Expedition.findOne({
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
      const expedition = await Expedition.findOne({
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