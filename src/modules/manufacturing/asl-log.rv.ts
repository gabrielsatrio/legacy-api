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
import { AslLogInput } from './asl-log.in';
import { AslLog } from './entities/asl-log';

@Resolver(AslLog)
export class AslLogResolver {
  @Query(() => AslLog, { nullable: true })
  @UseMiddleware(isAuth)
  async getAslLog(
    @Arg('aslId') aslId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<AslLog | null> {
    try {
      return await AslLog.findOneBy({ aslId, lineNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AslLog], { nullable: true })
  @UseMiddleware(isAuth)
  async getAslLogById(
    @Arg('aslId') aslId: number
  ): Promise<AslLog[] | undefined> {
    try {
      return await AslLog.findBy({ aslId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewLineAslLog(@Arg('aslId') aslId: number): Promise<number> {
    try {
      const sql = `SELECT NVL(MAX(LINE_NO)+1,1) AS "lineNo" FROM ATJ_ASL_LOG
                   WHERE ASL_ID = :aslId`;
      const result = await ifs.query(sql, [aslId]);
      return result[0].lineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AslLog)
  @UseMiddleware(isAuth)
  async createAslLog(
    @Arg('input') input: AslLogInput,
    @Ctx() { req }: Context
  ): Promise<AslLog> {
    try {
      const existingData = await AslLog.findOneBy({
        aslId: input.aslId,
        lineNo: input.lineNo
      });
      if (existingData) throw new Error('Data already exists.');
      const data = AslLog.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await AslLog.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AslLog, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAslLog(
    @Arg('input') input: AslLogInput
  ): Promise<AslLog | undefined> {
    try {
      const data = await AslLog.findOneBy({
        aslId: input.aslId,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      AslLog.merge(data, {
        ...input
      });
      const result = await AslLog.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AslLog)
  @UseMiddleware(isAuth)
  async deleteAslLog(
    @Arg('aslId') aslId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<AslLog> {
    try {
      const data = await AslLog.findOneBy({ aslId, lineNo });
      if (!data) throw new Error('No data found.');
      await AslLog.delete({ aslId, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
