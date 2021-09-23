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
  async getAllExpeditions(): // @Arg('contract', () => [String])
  // contract: string[],
  // @Ctx() { req }: Context
  Promise<Expedition[] | undefined> {
    return Expedition.find();
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
    //@Ctx() { req }: Context
  ): Promise<Expedition | undefined> {
    let result;
    //const createdBy: string = req.session.userId;
    const sql = `
    BEGIN
      GBR_SPT_API.Create_Expedition(:expeditionId, :expeditionName, :outExpeditionId);
    END;
  `;

    try {
      result = await getConnection().query(sql, [
        input.expeditionId,
        input.expeditionName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outExpeditionId = result[0] as string;
    const data = Expedition.findOne({
      expeditionId: outExpeditionId
    });
    return data;
  }

  @Mutation(() => Expedition, { nullable: true })
  @UseMiddleware(isAuth)
  async updateExpedition(
    @Arg('input') input: ExpeditionInput
  ): Promise<Expedition | undefined> {
    let result;
    const expedition = await Expedition.findOne({
      expeditionId: input.expeditionId
    });
    if (!expedition) {
      return undefined;
    }
    const sql = `
    BEGIN
      GBR_SPT_API.UPDATE_EXPEDITION(:expeditionId, :expeditionName, :outExpeditionId);
    END;
  `;
    try {
      result = await getConnection().query(sql, [
        input.expeditionId,
        input.expeditionName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outExpeditionId = result[0];
    const data = Expedition.findOne({
      expeditionId: outExpeditionId
    });
    return data;
  }

  @Mutation(() => Expedition)
  @UseMiddleware(isAuth)
  async deleteExpedition(
    @Arg('expeditionId') expeditionId: string
    //@Ctx() { req }: Context
  ): Promise<Expedition> {
    //const createdBy: string = req.session.userId;
    const expedition = await Expedition.findOne({
      expeditionId
    });
    if (!expedition) throw new Error('No data found.');
    try {
      await Expedition.delete({ expeditionId });
      return expedition;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
