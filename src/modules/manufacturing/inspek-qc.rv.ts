import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { DailyProdATEInput } from './daily-prod-ATE.in';
import { DailyProdATE } from './entities/daily-prod-ATE';
import { InspekQc } from './entities/inspek-qc';

@Resolver(InspekQc)
export class InspekQcResolver {
  @Query(() => [InspekQc], { nullable: true })
  @UseMiddleware(isAuth)
  async getInspekQcByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<InspekQc[] | undefined> {
    return await InspekQc.find({});
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
      const data = await DailyProdATE.findOne({
        objId: input.objId
      });
      if (!data) throw new Error('No data found.');
      DailyProdATE.merge(data, input);
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
      const data = await DailyProdATE.findOne({
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
