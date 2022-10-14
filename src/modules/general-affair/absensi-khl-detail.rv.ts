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
import { AbsensiKhlDetailInput } from './absensi-khl-detail.in';
import { AbsensiKhlDetail } from './entities/absensi-khl-detail';
import { AbsensiKhlDetailView } from './entities/absensi-khl-detail.vw';

@Resolver(AbsensiKhlDetail)
export class AbsensiKhlDetailResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkAbsensiKhlDetailExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getAbsensiKhlDetail(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AbsensiKhlDetailView])
  @UseMiddleware(isAuth)
  async getAllAbsensiKhlDetail(): Promise<AbsensiKhlDetail[] | undefined> {
    try {
      return await AbsensiKhlDetailView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AbsensiKhlDetailView], { nullable: true })
  @UseMiddleware(isAuth)
  async getAbsensiKhlByMaster(
    @Arg('employeeKhlId', () => Int) employeeKhlId: number
  ): Promise<AbsensiKhlDetailView[] | undefined> {
    try {
      return await AbsensiKhlDetailView.findBy({ employeeKhlId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => AbsensiKhlDetailView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAbsensiKhlDetail(
    @Arg('id', () => Int) id: number
  ): Promise<AbsensiKhlDetailView | null> {
    try {
      return await AbsensiKhlDetailView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AbsensiKhlDetail)
  @UseMiddleware(isAuth)
  async createAbsensiKhlDetail(
    @Arg('input') input: AbsensiKhlDetailInput
  ): Promise<AbsensiKhlDetail | undefined> {
    try {
      const existingData = await AbsensiKhlDetail.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = AbsensiKhlDetail.create({
        ...input
      });
      const result = await AbsensiKhlDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AbsensiKhlDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAbsensiKhlDetail(
    @Arg('input') input: AbsensiKhlDetailInput
  ): Promise<AbsensiKhlDetail | undefined> {
    try {
      const data = await AbsensiKhlDetail.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      AbsensiKhlDetail.merge(data, { ...input });
      const result = await AbsensiKhlDetail.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AbsensiKhlDetail)
  @UseMiddleware(isAuth)
  async deleteAbsensiKhlDetail(
    @Arg('id', () => Int) id: number
  ): Promise<AbsensiKhlDetail> {
    try {
      const data = await AbsensiKhlDetail.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await AbsensiKhlDetail.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
