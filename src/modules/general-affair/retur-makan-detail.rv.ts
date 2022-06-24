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
import { ReturMakanDetail } from './entities/retur-makan-detail';
import { ReturMakanDetailView } from './entities/retur-makan-detail.vw';
import { ReturMakanDetailInput } from './retur-makan-detail.in';

@Resolver(ReturMakanDetail)
export class ReturMakanDetailResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkReturMakanDetailExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getReturMakanDetail(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ReturMakanDetailView])
  @UseMiddleware(isAuth)
  async getAllReturMakanDetail(): Promise<ReturMakanDetail[] | undefined> {
    try {
      return await ReturMakanDetailView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ReturMakanDetailView], { nullable: true })
  @UseMiddleware(isAuth)
  async getReturMakanByMaster(
    @Arg('returMakanId', () => Int) returMakanId: number
  ): Promise<ReturMakanDetailView[] | undefined> {
    try {
      return await ReturMakanDetailView.findBy({ returMakanId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => ReturMakanDetailView, { nullable: true })
  @UseMiddleware(isAuth)
  async getReturMakanDetail(
    @Arg('id', () => Int) id: number
  ): Promise<ReturMakanDetailView | null> {
    try {
      return await ReturMakanDetail.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturMakanDetail)
  @UseMiddleware(isAuth)
  async createReturMakanDetail(
    @Arg('input') input: ReturMakanDetailInput
  ): Promise<ReturMakanDetail | undefined> {
    try {
      const existingData = await ReturMakanDetail.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = ReturMakanDetail.create({
        ...input
      });
      const result = await ReturMakanDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturMakanDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async updateReturMakanDetail(
    @Arg('input') input: ReturMakanDetailInput
  ): Promise<ReturMakanDetail | undefined> {
    try {
      const data = await ReturMakanDetail.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      ReturMakanDetail.merge(data, { ...input });
      const result = await ReturMakanDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturMakanDetail)
  @UseMiddleware(isAuth)
  async deleteReturMakanDetail(
    @Arg('id', () => Int) id: number
  ): Promise<ReturMakanDetail> {
    try {
      const data = await ReturMakanDetail.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await ReturMakanDetail.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
