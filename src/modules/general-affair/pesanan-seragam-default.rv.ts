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
import { DefaultSeragam } from './entities/pesanan-seragam-default';
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

  @Mutation(() => DefaultSeragam)
  @UseMiddleware(isAuth)
  async createDefaultSeragam(
    @Arg('input') input: DefaultSeragamInput
  ): Promise<DefaultSeragam | undefined> {
    try {
      const data = await DefaultSeragam.findOneBy({
        tahun: input.tahun,
        periode: input.periode,
        idJenis: input.idJenis
      });
      if (data) throw new Error('Data already exist!');
      const locked = await DefaultSeragam.findOneBy({
        tahun: input.tahun,
        periode: input.periode
      });
      if (locked?.isLocked)
        throw new Error(
          `Data already locked for this year (${input.tahun}) and period (${input.periode})`
        );
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
  async deleteDSByYearAndPeriod(
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<boolean | undefined> {
    try {
      const exist = await DefaultSeragam.findBy({
        tahun,
        periode
      });
      if (!exist) throw new Error('Data not exist!');
      await DefaultSeragam.delete({ tahun, periode });
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async toggleLock(
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<boolean | undefined> {
    try {
      const data = await DefaultSeragam.findOneBy({
        tahun,
        periode
      });
      if (!data) throw new Error('Data not exist!');
      await ifs.query(
        `
          BEGIN
            vky_default_seragam_api.toggle_lock(:tahun, :periode);
          END;
        `,
        [tahun, periode]
      );
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async generateSeragam(
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number,
    @Arg('createdBy', () => String) createdBy: string
  ): Promise<boolean | undefined> {
    try {
      const exist = await DefaultSeragam.findOneBy({
        tahun,
        periode
      });
      if (exist) throw new Error('Data already exist');
      const sql = `
        BEGIN
          VKY_DEFAULT_SERAGAM_API.GENERATE_DEFAULT_SERAGAM(:tahun, :periode, :createdBy);
        END;
      `;
      await ifs.query(sql, [tahun, periode, createdBy]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
