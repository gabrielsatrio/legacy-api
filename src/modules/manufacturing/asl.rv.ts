import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { AslInput } from './asl.in';
import { Asl } from './entities/asl';

@Resolver(Asl)
export class AslResolver {
  @Query(() => Asl, { nullable: true })
  @UseMiddleware(isAuth)
  async getAsl(@Arg('aslId') aslId: number): Promise<Asl | null> {
    try {
      return await Asl.findOneBy({ aslId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [Asl], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllAsl(): Promise<Asl[] | null> {
    try {
      return await Asl.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [Asl], { nullable: true })
  @UseMiddleware(isAuth)
  async getAslByCategory(
    @Arg('category', () => String) category: string
  ): Promise<Asl[] | undefined> {
    try {
      return await Asl.findBy({
        category
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewAslId(): Promise<number> {
    try {
      const sql = 'SELECT ATJ_ASL_SEQ.NEXTVAL AS "aslId" FROM DUAL';
      const result = await ifs.query(sql);
      return result[0].aslId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Asl)
  @UseMiddleware(isAuth)
  async createAsl(
    @Arg('input') input: AslInput,
    @Ctx() { req }: Context
  ): Promise<Asl> {
    try {
      const existingData = await Asl.findOneBy({
        aslId: input.aslId
      });
      if (existingData) throw new Error('Data already exists.');
      const data = Asl.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await Asl.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Asl, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAsl(@Arg('input') input: AslInput): Promise<Asl | undefined> {
    try {
      const data = await Asl.findOneBy({
        aslId: input.aslId
      });
      if (!data) throw new Error('No data found.');
      Asl.merge(data, {
        ...input
      });
      const result = await Asl.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Asl)
  @UseMiddleware(isAuth)
  async deleteAsl(@Arg('aslId') aslId: number): Promise<Asl> {
    try {
      const data = await Asl.findOneBy({ aslId });
      if (!data) throw new Error('No data found.');
      await Asl.delete({ aslId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
