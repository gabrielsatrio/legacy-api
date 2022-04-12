import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { DailyProdATEInput } from './daily-prod-ATE.in';
import { DailyProdATE } from './entities/daily-prod-ATE';

@Resolver(DailyProdATE)
export class DailyProdATEResolver {
  @Query(() => [DailyProdATE], { nullable: true })
  @UseMiddleware(isAuth)
  async getDailyProdATE(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<DailyProdATE[] | undefined> {
    return await DailyProdATE.findBy({
      contract: In(contract)
    });
  }

  @Mutation(() => DailyProdATE)
  @UseMiddleware(isAuth)
  async createDailyProdATE(
    @Arg('input') input: DailyProdATEInput
  ): Promise<DailyProdATE | undefined> {
    try {
      const data = DailyProdATE.create({
        ...input
      });
      const results = await DailyProdATE.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DailyProdATE, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDailyProdATE(
    @Arg('input') input: DailyProdATEInput
  ): Promise<DailyProdATE | undefined> {
    try {
      const data = await DailyProdATE.findOneBy({
        objId: input.objId
      });
      if (!data) throw new Error('No data found.');
      DailyProdATE.merge(data, { ...input });
      const results = await DailyProdATE.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DailyProdATE)
  @UseMiddleware(isAuth)
  async deleteDailyProdATE(@Arg('objId') objId: string): Promise<DailyProdATE> {
    try {
      const data = await DailyProdATE.findOneBy({
        objId
      });
      if (!data) throw new Error('No data found.');
      await DailyProdATE.delete({ objId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
