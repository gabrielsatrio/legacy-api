import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ReturRoti } from './entities/retur-roti';
import { ReturRotiView } from './entities/retur-roti.vw';
import { ReturRotiInput } from './retur-roti.in';

@Resolver(ReturRoti)
export class ReturRotiResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkReturRotiExist(@Arg('id') id: number): Promise<boolean> {
    return (await this.getReturRoti(id)) ? true : false;
  }

  @Query(() => [ReturRotiView])
  @UseMiddleware(isAuth)
  async getAllReturRoti(): Promise<ReturRotiView[] | undefined> {
    return await ReturRoti.find();
  }

  @Query(() => ReturRotiView, { nullable: true })
  @UseMiddleware(isAuth)
  async getReturRoti(@Arg('id') id: number): Promise<ReturRotiView | null> {
    return await ReturRotiView.findOneBy({ id });
  }

  @Mutation(() => ReturRoti)
  @UseMiddleware(isAuth)
  async createReturRoti(
    @Arg('input') input: ReturRotiInput
  ): Promise<ReturRoti | undefined> {
    try {
      const existingData = await ReturRoti.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = ReturRoti.create({
        ...input
      });
      const result = await ReturRoti.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturRoti, { nullable: true })
  @UseMiddleware(isAuth)
  async updateReturRoti(
    @Arg('input') input: ReturRotiInput
  ): Promise<ReturRoti | undefined> {
    try {
      const data = await ReturRoti.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      ReturRoti.merge(data, { ...input });
      const result = await ReturRoti.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturRoti)
  @UseMiddleware(isAuth)
  async deleteReturRoti(@Arg('id') id: number): Promise<ReturRoti> {
    try {
      const data = await ReturRoti.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await ReturRoti.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
