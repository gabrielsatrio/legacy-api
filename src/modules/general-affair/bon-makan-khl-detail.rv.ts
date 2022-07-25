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
import { BonMakanKhlDetailInput } from './bon-makan-khl-detail.in';
import { BonMakanKhlDetail } from './entities/bon-makan-khl-detail';
import { BonMakanKhlDetailView } from './entities/bon-makan-khl-detail.vw';

@Resolver(BonMakanKhlDetail)
export class BonMakanKhlDetailResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkBonMakanKhlDetailExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getBonMakanKhlDetail(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [BonMakanKhlDetailView])
  @UseMiddleware(isAuth)
  async getAllBonMakanKhlDetail(): Promise<
    BonMakanKhlDetailView[] | undefined
  > {
    try {
      return await BonMakanKhlDetail.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => BonMakanKhlDetailView, { nullable: true })
  @UseMiddleware(isAuth)
  async getBonMakanKhlDetail(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanKhlDetailView | null> {
    try {
      return await BonMakanKhlDetailView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanKhlDetail)
  @UseMiddleware(isAuth)
  async createBonMakanKhlDetail(
    @Arg('input') input: BonMakanKhlDetailInput
  ): Promise<BonMakanKhlDetail | undefined> {
    try {
      const existingData = await BonMakanKhlDetail.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = BonMakanKhlDetail.create({
        ...input
      });
      const result = await BonMakanKhlDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanKhlDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBonMakanKhlDetail(
    @Arg('input') input: BonMakanKhlDetailInput
  ): Promise<BonMakanKhlDetail | undefined> {
    try {
      const data = await BonMakanKhlDetail.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      BonMakanKhlDetail.merge(data, { ...input });
      const result = await BonMakanKhlDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanKhlDetail)
  @UseMiddleware(isAuth)
  async deleteBonMakanKhlDetail(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanKhlDetail> {
    try {
      const data = await BonMakanKhlDetail.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await BonMakanKhlDetail.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [BonMakanKhlDetailView], { nullable: true })
  @UseMiddleware(isAuth)
  async getBonMakanKhlByMaster(
    @Arg('bonMakanKhlId', () => Int) bonMakanKhlId: number
  ): Promise<BonMakanKhlDetailView[] | undefined> {
    try {
      return await BonMakanKhlDetailView.findBy({ bonMakanKhlId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
