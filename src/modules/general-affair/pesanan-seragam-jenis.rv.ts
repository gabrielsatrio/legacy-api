import { isAuth } from '@/middlewares/is-auth';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { mapError } from './../../utils/map-error';
import { JenisSeragam } from './entities/pesanan-seragam-jenis';
import { JenisSeragamView } from './entities/pesanan-seragam-jenis.vw';
import { JenisSeragamInput } from './pesanan-seragam-jenis.in';

@Resolver(JenisSeragam)
export class JenisSeragamResolver {
  @Query(() => [JenisSeragamView])
  @UseMiddleware(isAuth)
  async getAllJenisSeragam(): Promise<JenisSeragamView[] | undefined> {
    try {
      return await JenisSeragamView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => JenisSeragamView)
  @UseMiddleware(isAuth)
  async getJenisSeragam(
    @Arg('id', () => Int) id: number
  ): Promise<JenisSeragamView | null> {
    try {
      return await JenisSeragamView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => JenisSeragam)
  @UseMiddleware(isAuth)
  async createJenisSeragam(
    @Arg('input') input: JenisSeragamInput
  ): Promise<JenisSeragam | undefined> {
    try {
      const exist = await JenisSeragam.findOneBy({ jenis: input.jenis });
      if (exist) throw new Error(mapError('Data already exist!'));
      const result = JenisSeragam.create({ ...input });
      await JenisSeragam.save(result);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => JenisSeragam)
  @UseMiddleware(isAuth)
  async updateJenisSeragam(
    @Arg('input') input: JenisSeragamInput
  ): Promise<JenisSeragam | undefined> {
    try {
      const data = await JenisSeragam.findOneBy({ id: input.id });
      if (!data) throw new Error(mapError('Data not exist!'));
      JenisSeragam.merge(data, { ...input });
      const result = await JenisSeragam.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteJenisSeragam(
    @Arg('id', () => Int) id: number
  ): Promise<boolean | undefined> {
    try {
      const exist = await JenisSeragam.findOneBy({ id });
      if (!exist) throw new Error(mapError('Data not exist!'));
      await JenisSeragam.delete({ id });
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
