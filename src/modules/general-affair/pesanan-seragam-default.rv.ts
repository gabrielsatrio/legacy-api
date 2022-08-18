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
import { DefaultSeragam } from './entities/pesanan-seragam-default';
import { DefaultSeragamDetailView } from './entities/pesanan-seragam-default-detail.vw';
import { DefaultSeragamView } from './entities/pesanan-seragam-default.vw';
import { DefaultSeragamInput } from './pesanan-seragam-default.in';

@Resolver(DefaultSeragam)
export class DefaultSeragamResolver {
  @Query(() => [DefaultSeragamView])
  @UseMiddleware(isAuth)
  async getAllDefaultSeragam(): Promise<DefaultSeragamView[] | undefined> {
    try {
      return await DefaultSeragamView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [DefaultSeragamDetailView])
  @UseMiddleware(isAuth)
  async getDefaultSeragam(
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<DefaultSeragamDetailView[] | undefined> {
    try {
      return await DefaultSeragamDetailView.findBy({
        tahun: tahun,
        periode: periode
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DefaultSeragam)
  @UseMiddleware(isAuth)
  async createDefaultSeragam(
    @Arg('input') input: DefaultSeragamInput
  ): Promise<DefaultSeragam | undefined> {
    try {
      const data = await DefaultSeragam.findOneBy({
        tahun: input.tahun,
        periode: input.periode,
        jenis: input.jenis
      });
      if (data) throw new Error('Data already exist!');
      const result = DefaultSeragam.create({ ...input });
      await DefaultSeragam.save(result);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DefaultSeragam)
  @UseMiddleware(isAuth)
  async updateDefaultSeragam(
    @Arg('input') input: DefaultSeragamInput
  ): Promise<DefaultSeragam | undefined> {
    try {
      const data = await DefaultSeragam.findOneBy({ id: input.id });
      if (!data) throw new Error('Data not exist!');
      DefaultSeragam.merge(data, { ...input });
      const result = await DefaultSeragam.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteDefaultSeragam(
    @Arg('id', () => Int) id: number
  ): Promise<boolean | undefined> {
    try {
      const exist = await DefaultSeragam.findOneBy({ id });
      if (!exist) throw new Error('Data not exist!');
      await DefaultSeragam.delete({ id });
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async toggleLock(
    @Arg('id', () => Int) id: number
  ): Promise<boolean | undefined> {
    try {
      const data = await DefaultSeragam.findOneBy({ id });
      if (!data) throw new Error('Data not exist!');
      if (data.isLocked) DefaultSeragam.merge(data, { isLocked: false });
      else DefaultSeragam.merge(data, { isLocked: true });
      await DefaultSeragam.save(data);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
