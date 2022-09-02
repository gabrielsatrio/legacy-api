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
import { PesananSeragam } from './entities/pesanan-seragam';
import { PesananSeragamView } from './entities/pesanan-seragam.vw';
import { PesananSeragamInput } from './pesanan-seragam.in';

@Resolver(PesananSeragam)
export class PesananSeragamResolver {
  @Query(() => [PesananSeragamView])
  @UseMiddleware(isAuth)
  async getPesananSeragam(
    @Arg('plant', () => String) plant: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<PesananSeragamView[] | undefined> {
    try {
      return await PesananSeragamView.findBy({
        plant: plant,
        tahun: tahun,
        periode: periode
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [PesananSeragamView])
  @UseMiddleware(isAuth)
  async getPesananSeragamUser(
    @Arg('nrp', () => String) nrp: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<PesananSeragamView[] | undefined> {
    try {
      return await PesananSeragamView.findBy({
        nrp: nrp,
        tahun: tahun,
        periode: periode
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PesananSeragam)
  @UseMiddleware(isAuth)
  async createPesananSeragam(
    @Arg('input') input: PesananSeragamInput
  ): Promise<PesananSeragam | undefined> {
    try {
      const data = PesananSeragam.create({ ...input });
      await PesananSeragam.save(data);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PesananSeragam)
  @UseMiddleware(isAuth)
  async updatePesananSeragam(
    @Arg('input') input: PesananSeragamInput
  ): Promise<PesananSeragam | undefined> {
    try {
      const data = await PesananSeragam.findOneBy({ id: input.id });
      if (!data) throw new Error('Data not exist');
      PesananSeragam.merge(data, { ...input });
      const result = await PesananSeragam.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePesananSeragam(
    @Arg('id', () => Int) id: number
  ): Promise<boolean | undefined> {
    try {
      const data = await PesananSeragam.findOneBy({ id });
      if (!data) throw new Error('Data not exist!');
      await PesananSeragam.delete({ id });
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async lockPesananSeragam(
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<boolean | undefined> {
    try {
      const data = await PesananSeragam.findBy({
        periode: periode,
        tahun: tahun
      });
      if (!data) throw new Error('Data not exist!');
      await PesananSeragam.createQueryBuilder()
        .update('PesananSeragam')
        .set({ isLocked: true })
        .where('TAHUN = :tahun AND PERIODE = :periode', {
          tahun: tahun,
          periode: periode
        })
        .execute();
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async unlockPesananSeragam(
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<boolean | undefined> {
    try {
      const data = await PesananSeragam.findBy({
        periode: periode,
        tahun: tahun
      });
      if (!data) throw new Error('Data not exist!');
      await PesananSeragam.createQueryBuilder()
        .update('PesananSeragam')
        .set({ isLocked: false })
        .where('TAHUN = :tahun AND PERIODE = :periode', {
          tahun: tahun,
          periode: periode
        })
        .execute();
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => [PesananSeragamView])
  @UseMiddleware(isAuth)
  async generatePesanan(
    @Arg('nrp', () => String) nrp: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<PesananSeragamView[] | undefined> {
    try {
      const exist = await PesananSeragamView.findOneBy({
        nrp: nrp,
        tahun: tahun,
        periode: periode
      });
      if (exist) throw new Error('Data already exist!');
      const sql = `
        BEGIN
          vky_pesanan_seragam_api.generate_pesanan(:nrp, :tahun, :periode);
        END;
      `;
      await PesananSeragam.query(sql, [nrp, tahun, periode]);
      return await PesananSeragamView.findBy({
        nrp: nrp,
        tahun: tahun,
        periode: periode
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
