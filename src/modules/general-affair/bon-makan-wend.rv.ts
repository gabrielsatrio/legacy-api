import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { BonMakanWeekendInput } from './bon-makan-wend.in';
import { BonMakanWeekend } from './entities/bon-makan-wend';
import { BonMakanWeekendView } from './entities/bon-makan-wend.vw';

@Resolver(BonMakanWeekend)
export class BonMakanWeekendResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkBonMakanWeekendExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    return (await this.getBonMakanWeekend(id)) ? true : false;
  }

  @Query(() => [BonMakanWeekendView])
  @UseMiddleware(isAuth)
  async getAllBonMakanWeekend(): Promise<BonMakanWeekendView[] | undefined> {
    return await BonMakanWeekend.find();
  }

  @Query(() => BonMakanWeekendView, { nullable: true })
  @UseMiddleware(isAuth)
  async getBonMakanWeekend(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanWeekendView | null> {
    return await BonMakanWeekendView.findOneBy({ id });
  }

  @Mutation(() => BonMakanWeekend)
  @UseMiddleware(isAuth)
  async createBonMakanWeekend(
    @Arg('input') input: BonMakanWeekendInput
  ): Promise<BonMakanWeekend | undefined> {
    try {
      const existingData = await BonMakanWeekend.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = BonMakanWeekend.create({
        ...input
      });
      const result = await BonMakanWeekend.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekend, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBonMakanWeekend(
    @Arg('input') input: BonMakanWeekendInput
  ): Promise<BonMakanWeekend | undefined> {
    try {
      const data = await BonMakanWeekend.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      BonMakanWeekend.merge(data, { ...input });
      const result = await BonMakanWeekend.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekend)
  @UseMiddleware(isAuth)
  async deleteBonMakanWeekend(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanWeekend> {
    try {
      const data = await BonMakanWeekend.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await BonMakanWeekend.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
