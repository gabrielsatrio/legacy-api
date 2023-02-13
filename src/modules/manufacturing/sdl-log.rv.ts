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
import { SdlLog } from './entities/sdl-log';
import { SdlLogInput } from './sdl-log.in';

@Resolver(SdlLog)
export class SdlLogResolver {
  @Query(() => SdlLog, { nullable: true })
  @UseMiddleware(isAuth)
  async getSdlLog(
    @Arg('sdlId') sdlId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<SdlLog | null> {
    try {
      return await SdlLog.findOneBy({ sdlId, lineNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [SdlLog], { nullable: true })
  @UseMiddleware(isAuth)
  async getSdlLogById(
    @Arg('sdlId') sdlId: number
  ): Promise<SdlLog[] | undefined> {
    try {
      return await SdlLog.findBy({ sdlId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewLineSdlLog(@Arg('sdlId') sdlId: number): Promise<number> {
    try {
      const sql = `SELECT NVL(MAX(LINE_NO)+1,1) AS "lineNo" FROM ATJ_SDL_LOG
                   WHERE SDL_ID = :sdlId`;
      const result = await ifs.query(sql, [sdlId]);
      return result[0].lineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SdlLog)
  @UseMiddleware(isAuth)
  async createSdlLog(
    @Arg('input') input: SdlLogInput,
    @Ctx() { req }: Context
  ): Promise<SdlLog> {
    try {
      const existingData = await SdlLog.findOneBy({
        sdlId: input.sdlId,
        lineNo: input.lineNo
      });
      if (existingData) throw new Error('Data already exists.');
      const data = SdlLog.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await SdlLog.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SdlLog, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSdlLog(
    @Arg('input') input: SdlLogInput
  ): Promise<SdlLog | undefined> {
    try {
      const data = await SdlLog.findOneBy({
        sdlId: input.sdlId,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      SdlLog.merge(data, {
        ...input
      });
      const result = await SdlLog.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SdlLog)
  @UseMiddleware(isAuth)
  async deleteSdlLog(
    @Arg('sdlId') sdlId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<SdlLog> {
    try {
      const data = await SdlLog.findOneBy({ sdlId, lineNo });
      if (!data) throw new Error('No data found.');
      await SdlLog.delete({ sdlId, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
