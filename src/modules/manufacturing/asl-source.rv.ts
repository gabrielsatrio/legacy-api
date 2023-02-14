import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { Context } from '../../types/context';
import { AslSourceInput } from './asl-source.in';
import { AslSource } from './entities/asl-source';

@Resolver(AslSource)
export class AslSourceResolver {
  @Query(() => AslSource, { nullable: true })
  @UseMiddleware(isAuth)
  async getAslSource(
    @Arg('aslId') aslId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<AslSource | null> {
    try {
      return await AslSource.findOneBy({ aslId, lineNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AslSource], { nullable: true })
  @UseMiddleware(isAuth)
  async getAslSourceById(
    @Arg('aslId') aslId: number
  ): Promise<AslSource[] | undefined> {
    try {
      return await AslSource.findBy({ aslId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewLineAslSource(@Arg('aslId') aslId: number): Promise<number> {
    try {
      const sql = `SELECT NVL(MAX(LINE_NO)+1,1) AS "lineNo" FROM ATJ_ASL_SOURCE
      WHERE ASL_ID = :aslId`;
      const result = await ifs.query(sql, [aslId]);
      return result[0].lineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AslSource)
  @UseMiddleware(isAuth)
  async createAslSource(
    @Arg('input') input: AslSourceInput,
    @Ctx() { req }: Context
  ): Promise<AslSource> {
    try {
      const existingData = await AslSource.findOneBy({
        aslId: input.aslId,
        lineNo: input.lineNo
      });
      if (existingData) throw new Error('Data already exists.');
      const data = AslSource.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await AslSource.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AslSource, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAslSource(
    @Arg('input') input: AslSourceInput
  ): Promise<AslSource | undefined> {
    try {
      const data = await AslSource.findOneBy({
        aslId: input.aslId,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      AslSource.merge(data, {
        ...input
      });
      const result = await AslSource.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AslSource)
  @UseMiddleware(isAuth)
  async deleteAslSource(
    @Arg('aslId') aslId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<AslSource> {
    try {
      const data = await AslSource.findOneBy({ aslId, lineNo });
      if (!data) throw new Error('No data found.');
      await AslSource.delete({ aslId, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
