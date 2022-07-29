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
import { ReturMakan } from './entities/retur-makan';
import { ReturMakanView } from './entities/retur-makan.vw';
import { ReturMakanInput } from './retur-makan.in';

@Resolver(ReturMakan)
export class ReturMakanResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkReturMakanExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getReturMakan(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ReturMakanView])
  @UseMiddleware(isAuth)
  async getAllReturMakan(): Promise<ReturMakanView[] | undefined> {
    try {
      return await ReturMakan.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => ReturMakanView, { nullable: true })
  @UseMiddleware(isAuth)
  async getReturMakan(
    @Arg('id', () => Int) id: number
  ): Promise<ReturMakanView | null> {
    try {
      return await ReturMakanView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturMakan)
  @UseMiddleware(isAuth)
  async createReturMakan(
    @Arg('input') input: ReturMakanInput
  ): Promise<ReturMakan | undefined> {
    try {
      const existingData = await ReturMakan.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = ReturMakan.create({
        ...input
      });
      const result = await ReturMakan.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturMakan, { nullable: true })
  @UseMiddleware(isAuth)
  async updateReturMakan(
    @Arg('input') input: ReturMakanInput
  ): Promise<ReturMakan | undefined> {
    try {
      const data = await ReturMakan.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      ReturMakan.merge(data, { ...input });
      const result = await ReturMakan.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ReturMakan)
  @UseMiddleware(isAuth)
  async deleteReturMakan(
    @Arg('id', () => Int) id: number
  ): Promise<ReturMakan> {
    try {
      const data = await ReturMakan.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await ReturMakan.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdReturMakan(): Promise<number> {
    try {
      const sql = `SELECT ANG_RETUR_MAKAN_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ReturMakanView], { nullable: true })
  @UseMiddleware(isAuth)
  async getReturMakanByUser(
    @Arg('createdBy') createdBy: string
  ): Promise<ReturMakanView[] | undefined> {
    try {
      return await ReturMakanView.findBy({ createdBy });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
