import { ifs } from '@/database/data-sources';
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
import { Like } from 'typeorm';
import { ReturRoti } from './entities/retur-roti';
import { ReturRotiView } from './entities/retur-roti.vw';
import { ReturRotiInput } from './retur-roti.in';

@Resolver(ReturRoti)
export class ReturRotiResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkReturRotiExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getReturRoti(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ReturRotiView])
  @UseMiddleware(isAuth)
  async getAllReturRoti(): Promise<ReturRotiView[] | undefined> {
    try {
      return await ReturRoti.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => ReturRotiView, { nullable: true })
  @UseMiddleware(isAuth)
  async getReturRoti(
    @Arg('id', () => Int) id: number
  ): Promise<ReturRotiView | null> {
    try {
      return await ReturRotiView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
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
  async deleteReturRoti(@Arg('id', () => Int) id: number): Promise<ReturRoti> {
    try {
      const data = await ReturRoti.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await ReturRoti.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdReturRoti(): Promise<number> {
    try {
      const sql = `SELECT ANG_RETUR_ROTI_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ReturRotiView], { nullable: true })
  @UseMiddleware(isAuth)
  async getReturRotiByUser(
    @Arg('createdBy') createdBy: string
  ): Promise<ReturRotiView[] | undefined> {
    try {
      return await ReturRotiView.findBy({ createdBy });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ReturRotiView])
  @UseMiddleware(isAuth)
  async getReturRotiByCreated(
    @Arg('createdBy') createdBy: string
  ): Promise<ReturRotiView[] | undefined> {
    return await ReturRotiView.find({
      where: {
        createdBy: Like(createdBy)
      }
    });
  }
}
