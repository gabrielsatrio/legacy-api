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
import { SdlSource } from './entities/sdl-source';
import { SdlSourceInput } from './sdl-source.in';

@Resolver(SdlSource)
export class SdlSourceResolver {
  @Query(() => SdlSource, { nullable: true })
  @UseMiddleware(isAuth)
  async getSdlSource(
    @Arg('sdlId') sdlId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<SdlSource | null> {
    try {
      return await SdlSource.findOneBy({ sdlId, lineNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [SdlSource], { nullable: true })
  @UseMiddleware(isAuth)
  async getSdlSourceById(
    @Arg('sdlId') sdlId: number
  ): Promise<SdlSource[] | undefined> {
    try {
      return await SdlSource.findBy({ sdlId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewLineSdlSource(@Arg('sdlId') sdlId: number): Promise<number> {
    try {
      const sql = `SELECT NVL(MAX(LINE_NO)+1,1) AS "lineNo" FROM ATJ_SDL_SOURCE
      WHERE SDL_ID = :sdlId`;
      const result = await ifs.query(sql, [sdlId]);
      return result[0].lineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SdlSource)
  @UseMiddleware(isAuth)
  async createSdlSource(
    @Arg('input') input: SdlSourceInput,
    @Ctx() { req }: Context
  ): Promise<SdlSource> {
    try {
      const existingData = await SdlSource.findOneBy({
        sdlId: input.sdlId,
        lineNo: input.lineNo
      });
      if (existingData) throw new Error('Data already exists.');
      const data = SdlSource.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await SdlSource.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SdlSource, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSdlSource(
    @Arg('input') input: SdlSourceInput
  ): Promise<SdlSource | undefined> {
    try {
      const data = await SdlSource.findOneBy({
        sdlId: input.sdlId,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      SdlSource.merge(data, {
        ...input
      });
      const result = await SdlSource.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SdlSource)
  @UseMiddleware(isAuth)
  async deleteSdlSource(
    @Arg('sdlId') sdlId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<SdlSource> {
    try {
      const data = await SdlSource.findOneBy({ sdlId, lineNo });
      if (!data) throw new Error('No data found.');
      await SdlSource.delete({ sdlId, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
