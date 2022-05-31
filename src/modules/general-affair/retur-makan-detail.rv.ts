import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ReturMakanDetail } from './entities/retur-makan-detail';
import { ReturMakanDetailView } from './entities/retur-makan-detail.vw';
import { ReturMakanDetailInput } from './retur-makan-detail.in';

@Resolver(ReturMakanDetail)
export class ReturMakanDetailResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkReturMakanDetailExist(@Arg('id') id: number): Promise<boolean> {
    return (await this.getReturMakanDetail(id)) ? true : false;
  }

  @Query(() => [ReturMakanDetailView])
  @UseMiddleware(isAuth)
  async getAllReturMakanDetail(): Promise<ReturMakanDetail[] | undefined> {
    return await ReturMakanDetailView.find();
  }

  @Query(() => [ReturMakanDetailView], { nullable: true })
  @UseMiddleware(isAuth)
  async getReturMakanByMaster(
    @Arg('returMakanId') returMakanId: number
  ): Promise<ReturMakanDetailView[] | undefined> {
    return await ReturMakanDetailView.findBy({ returMakanId });
  }

  @Query(() => ReturMakanDetailView, { nullable: true })
  @UseMiddleware(isAuth)
  async getReturMakanDetail(
    @Arg('id') id: number
  ): Promise<ReturMakanDetailView | null> {
    return await ReturMakanDetail.findOneBy({ id });
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
    @Arg('id') id: number
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
