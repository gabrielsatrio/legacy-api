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
import { AngkutanDetailInput } from './angkutan-detail.in';
import { AngkutanDetail } from './entities/angkutan-detail';
import { AngkutanDetailView } from './entities/angkutan-detail.vw';

@Resolver(AngkutanDetail)
export class AngkutanDetailResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkAngkutanDetailExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getAngkutanDetail(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AngkutanDetailView])
  @UseMiddleware(isAuth)
  async getAllAngkutanDetail(): Promise<AngkutanDetailView[] | undefined> {
    try {
      return await AngkutanDetail.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AngkutanDetailView], { nullable: true })
  @UseMiddleware(isAuth)
  async getAngkutanDetailByMaster(
    @Arg('angkutanId', () => Int) angkutanId: number
  ): Promise<AngkutanDetailView[] | undefined> {
    try {
      return await AngkutanDetailView.findBy({ angkutanId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => AngkutanDetailView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAngkutanDetail(
    @Arg('id', () => Int) id: number
  ): Promise<AngkutanDetailView | null> {
    try {
      return await AngkutanDetailView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AngkutanDetail)
  @UseMiddleware(isAuth)
  async createAngkutanDetail(
    @Arg('input') input: AngkutanDetailInput
  ): Promise<AngkutanDetail | undefined> {
    try {
      const existingData = await AngkutanDetail.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = AngkutanDetail.create({
        ...input
      });
      const result = await AngkutanDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AngkutanDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAngkutanDetail(
    @Arg('input') input: AngkutanDetailInput
  ): Promise<AngkutanDetail | undefined> {
    try {
      const data = await AngkutanDetail.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      AngkutanDetail.merge(data, { ...input });
      const result = await AngkutanDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AngkutanDetail)
  @UseMiddleware(isAuth)
  async deleteAngkutanDetail(
    @Arg('id', () => Int) id: number
  ): Promise<AngkutanDetail> {
    try {
      const data = await AngkutanDetail.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await AngkutanDetail.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
