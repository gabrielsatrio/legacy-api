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
import { ReturRotiDetail } from './entities/retur-roti-detail';
import { ReturRotiDetailView } from './entities/retur-roti-detail.vw';
import { ReturRotiDetailInput } from './retur-roti-detail.in';

@Resolver(ReturRotiDetail)
export class ReturRotiDetailResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkReturRotiDetailExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    return (await this.getReturRotiDetail(id)) ? true : false;
  }

  @Query(() => [ReturRotiDetailView])
  @UseMiddleware(isAuth)
  async getAllReturRotiDetail(): Promise<ReturRotiDetail[] | undefined> {
    return await ReturRotiDetailView.find();
  }

  @Query(() => [ReturRotiDetailView], { nullable: true })
  @UseMiddleware(isAuth)
  async getReturRotiByMaster(
    @Arg('returRotiId', () => Int) returRotiId: number
  ): Promise<ReturRotiDetailView[] | undefined> {
    return await ReturRotiDetailView.findBy({ returRotiId });
  }

  @Query(() => ReturRotiDetailView, { nullable: true })
  @UseMiddleware(isAuth)
  async getReturRotiDetail(
    @Arg('id', () => Int) id: number
  ): Promise<ReturRotiDetailView | null> {
    return await ReturRotiDetail.findOneBy({ id });
  }

  @Mutation(() => ReturRotiDetail)
  @UseMiddleware(isAuth)
  async createReturRotiDetail(
    @Arg('input') input: ReturRotiDetailInput
  ): Promise<ReturRotiDetail | undefined> {
    try {
      const existingData = await ReturRotiDetail.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = ReturRotiDetail.create({
        ...input
      });
      const result = await ReturRotiDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturRotiDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async updateReturRotiDetail(
    @Arg('input') input: ReturRotiDetailInput
  ): Promise<ReturRotiDetail | undefined> {
    try {
      const data = await ReturRotiDetail.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      ReturRotiDetail.merge(data, { ...input });
      const result = await ReturRotiDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturRotiDetail)
  @UseMiddleware(isAuth)
  async deleteReturRotiDetail(
    @Arg('id', () => Int) id: number
  ): Promise<ReturRotiDetail> {
    try {
      const data = await ReturRotiDetail.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await ReturRotiDetail.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
