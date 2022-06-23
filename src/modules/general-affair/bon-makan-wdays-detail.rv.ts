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
import { BonMakanWeekdaysDetailInput } from './bon-makan-wdays-detail.in';
import { BonMakanWeekdaysDetail } from './entities/bon-makan-wdays-detail';
import { BonMakanWeekdaysDetailView } from './entities/bon-makan-wdays-detail.vw';

@Resolver(BonMakanWeekdaysDetail)
export class BonMakanWeekdaysDetailResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkBonMakanWeekdaysDetailExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getBonMakanWeekdaysDetail(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [BonMakanWeekdaysDetailView])
  @UseMiddleware(isAuth)
  async getAllBonMakanWeekdaysDetail(): Promise<
    BonMakanWeekdaysDetail[] | undefined
  > {
    try {
      return await BonMakanWeekdaysDetailView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [BonMakanWeekdaysDetailView], { nullable: true })
  @UseMiddleware(isAuth)
  async getBonMakanWeekdaysByMaster(
    @Arg('bonMakanWdaysId', () => Int) bonMakanWdaysId: number
  ): Promise<BonMakanWeekdaysDetailView[] | undefined> {
    try {
      return await BonMakanWeekdaysDetailView.findBy({ bonMakanWdaysId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => BonMakanWeekdaysDetailView, { nullable: true })
  @UseMiddleware(isAuth)
  async getBonMakanWeekdaysDetail(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanWeekdaysDetailView | null> {
    try {
      return await BonMakanWeekdaysDetail.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekdaysDetail)
  @UseMiddleware(isAuth)
  async createBonMakanWeekdaysDetail(
    @Arg('input') input: BonMakanWeekdaysDetailInput
  ): Promise<BonMakanWeekdaysDetail | undefined> {
    try {
      const existingData = await BonMakanWeekdaysDetail.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = BonMakanWeekdaysDetail.create({
        ...input
      });
      const result = await BonMakanWeekdaysDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekdaysDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBonMakanWeekdaysDetail(
    @Arg('input') input: BonMakanWeekdaysDetailInput
  ): Promise<BonMakanWeekdaysDetail | undefined> {
    try {
      const data = await BonMakanWeekdaysDetail.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      BonMakanWeekdaysDetail.merge(data, { ...input });
      const result = await BonMakanWeekdaysDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekdaysDetail)
  @UseMiddleware(isAuth)
  async deleteBonMakanWeekdaysDetail(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanWeekdaysDetail> {
    try {
      const data = await BonMakanWeekdaysDetail.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await BonMakanWeekdaysDetail.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
