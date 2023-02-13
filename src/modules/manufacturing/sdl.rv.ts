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
import { Sdl } from './entities/sdl';
import { SdlInput } from './sdl.in';

@Resolver(Sdl)
export class SdlResolver {
  @Query(() => Sdl, { nullable: true })
  @UseMiddleware(isAuth)
  async getSdl(@Arg('sdlId') sdlId: number): Promise<Sdl | null> {
    try {
      return await Sdl.findOneBy({ sdlId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [Sdl], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllSdl(): Promise<Sdl[] | null> {
    try {
      return await Sdl.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [Sdl], { nullable: true })
  @UseMiddleware(isAuth)
  async getSdlByCategory(
    @Arg('category', () => String) category: string
  ): Promise<Sdl[] | undefined> {
    try {
      return await Sdl.findBy({
        category
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewSdlId(): Promise<number> {
    try {
      const sql = 'SELECT ATJ_SDL_SEQ.NEXTVAL AS "sdlId" FROM DUAL';
      const result = await ifs.query(sql);
      return result[0].sdlId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Sdl)
  @UseMiddleware(isAuth)
  async createSdl(
    @Arg('input') input: SdlInput,
    @Ctx() { req }: Context
  ): Promise<Sdl> {
    try {
      const existingData = await Sdl.findOneBy({
        sdlId: input.sdlId
      });
      if (existingData) throw new Error('Data already exists.');
      const data = Sdl.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await Sdl.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Sdl, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSdl(@Arg('input') input: SdlInput): Promise<Sdl | undefined> {
    try {
      const data = await Sdl.findOneBy({
        sdlId: input.sdlId
      });
      if (!data) throw new Error('No data found.');
      Sdl.merge(data, {
        ...input
      });
      const result = await Sdl.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Sdl)
  @UseMiddleware(isAuth)
  async deleteSdl(@Arg('sdlId') sdlId: number): Promise<Sdl> {
    try {
      const data = await Sdl.findOneBy({ sdlId });
      if (!data) throw new Error('No data found.');
      await Sdl.delete({ sdlId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
