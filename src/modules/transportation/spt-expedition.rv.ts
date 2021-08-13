import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Expedition } from './entities/spt-expedition';
import { ExpeditionResponse } from './spt-expedition.dr';
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

  @Mutation(() => ExpeditionResponse)
  @UseMiddleware(isAuth)
  async createExpedition(
    @Arg('input') input: ExpeditionInput,
    @Ctx() { req }: Context
  ): Promise<ExpeditionResponse | undefined> {
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
      return setErrors(err.message);
    }
    const outExpeditionId = result[0] as string;
    const data = Expedition.findOne({
      expeditionId: outExpeditionId
    });
    return { success: true, data };
  }

  @Mutation(() => ExpeditionResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateExpedition(
    @Arg('input') input: ExpeditionInput
  ): Promise<ExpeditionResponse | undefined> {
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
      return setErrors(err.message);
    }
    const outExpeditionId = result[0];
    const data = Expedition.findOne({
      expeditionId: outExpeditionId
    });
    return { success: true, data };
  }

  @Mutation(() => ExpeditionResponse)
  @UseMiddleware(isAuth)
  async deleteExpedition(
    @Arg('expeditionId') expeditionId: string
    //@Ctx() { req }: Context
  ): Promise<ExpeditionResponse> {
    //const createdBy: string = req.session.userId;
    const expedition = await Expedition.findOne({
      expeditionId
    });
    if (!expedition) return setErrors('No data found.');
    try {
      await Expedition.delete({ expeditionId });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
