import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { LessThanOrEqual, MoreThan } from 'typeorm';
import { MessCostFixRate } from './entities/mess-cost-fr';
import { MessCostFixRateView } from './entities/mess-cost-fr.vw';
import { MessCostInput } from './mess-cost-fr.in';

@Resolver(MessCostFixRate)
export class MessCostFRResolver {
  @Query(() => [MessCostFixRateView])
  @UseMiddleware(isAuth)
  async getAllMessCost(): Promise<MessCostFixRateView[] | undefined> {
    try {
      return await MessCostFixRateView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => MessCostFixRateView)
  @UseMiddleware(isAuth)
  async getMessCost(
    @Arg('mess', () => String) mess: string
  ): Promise<MessCostFixRateView | null> {
    try {
      return await MessCostFixRateView.findOneBy({ mess });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => MessCostFixRate)
  @UseMiddleware(isAuth)
  async getMessCostByTime(
    @Arg('mess', () => String) mess: string,
    @Arg('date', () => Date) date: Date
  ): Promise<MessCostFixRate | null> {
    try {
      return await MessCostFixRate.findOne({
        where: {
          mess,
          validTo: MoreThan(date),
          validFrom: LessThanOrEqual(date)
        }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MessCostFixRate)
  @UseMiddleware(isAuth)
  async createMessCost(
    @Arg('input') input: MessCostInput
  ): Promise<MessCostFixRate | null> {
    try {
      const data = MessCostFixRate.create({ ...input });
      await MessCostFixRate.save(data);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
