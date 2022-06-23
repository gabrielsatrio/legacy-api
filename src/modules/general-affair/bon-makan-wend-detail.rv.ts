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
import { BonMakanWeekendDetailInput } from './bon-makan-wend-detail.in';
import { BonMakanWeekendDetail } from './entities/bon-makan-wend-detail';
import { BonMakanWeekendDetailView } from './entities/bon-makan-wend-detail.vw';

@Resolver(BonMakanWeekendDetail)
export class BonMakanWeekendDetailResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkBonMakanWeekendDetailExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    return (await this.getBonMakanWeekendDetail(id)) ? true : false;
  }

  @Query(() => [BonMakanWeekendDetailView])
  @UseMiddleware(isAuth)
  async getAllBonMakanWeekendDetail(): Promise<
    BonMakanWeekendDetail[] | undefined
  > {
    return await BonMakanWeekendDetailView.find();
  }

  @Query(() => [BonMakanWeekendDetailView], { nullable: true })
  @UseMiddleware(isAuth)
  async getBonMakanWeekendByMaster(
    @Arg('bonMakanWendId', () => Int) bonMakanWendId: number
  ): Promise<BonMakanWeekendDetailView[] | undefined> {
    return await BonMakanWeekendDetailView.findBy({ bonMakanWendId });
  }

  @Query(() => BonMakanWeekendDetailView, { nullable: true })
  @UseMiddleware(isAuth)
  async getBonMakanWeekendDetail(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanWeekendDetailView | null> {
    return await BonMakanWeekendDetail.findOneBy({ id });
  }

  @Mutation(() => BonMakanWeekendDetail)
  @UseMiddleware(isAuth)
  async createBonMakanWeekendDetail(
    @Arg('input') input: BonMakanWeekendDetailInput
  ): Promise<BonMakanWeekendDetail | undefined> {
    try {
      const existingData = await BonMakanWeekendDetail.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = BonMakanWeekendDetail.create({
        ...input
      });
      const result = await BonMakanWeekendDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekendDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBonMakanWeekendDetail(
    @Arg('input') input: BonMakanWeekendDetailInput
  ): Promise<BonMakanWeekendDetail | undefined> {
    try {
      const data = await BonMakanWeekendDetail.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      BonMakanWeekendDetail.merge(data, { ...input });
      const result = await BonMakanWeekendDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekendDetail)
  @UseMiddleware(isAuth)
  async deleteBonMakanWeekendDetail(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanWeekendDetail> {
    try {
      const data = await BonMakanWeekendDetail.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await BonMakanWeekendDetail.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
