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
      const isAdmin = await PesananSeragamView.query(
        `
          SELECT vky_pesanan_seragam_api.is_admin(:nrp)
          FROM   DUAL`,
        [nrp]
      );
      const deptId = await PesananSeragamView.query(
        `
          SELECT atj_employee_mv_api.get_department_id(:nrp)
          FROM DUAL`,
        [nrp]
      );
      const companyOffice = await PesananSeragamView.query(
        `
          SELECT atj_employee_mv_api.get_company_office(:nrp)
          FROM DUAL`,
        [nrp]
      );

      if (isAdmin === 0) {
        return await PesananSeragamView.findBy({
          nrp: nrp,
          tahun: tahun,
          periode: periode
        });
      } else {
        return await PesananSeragamView.findBy({
          deptId: deptId,
          plant: companyOffice,
          tahun: tahun,
          periode: periode
        });
      }
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
    @Arg('id', () => Int) id: number,
    @Arg('ukuranKemeja', () => String) ukuranKemeja: string,
    @Arg('ukuranCelana', () => Int) ukuranCelana: number,
    @Arg('jumlahKemeja', () => Int) jumlahKemeja: number,
    @Arg('jumlahCelana', () => Int) jumlahCelana: number,
    @Arg('keterangan', () => String) keterangan: string
  ): Promise<PesananSeragam | null> {
    try {
      const data = await PesananSeragam.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      const sql = `
        BEGIN
          vky_pesanan_seragam_api.update_pesanan_seragam(:id, :ukuranKemeja, :ukuranCelana, :jumlahKemeja, :jumlahCelana, :keterangan);
        END;
      `;
      await PesananSeragam.query(sql, [
        id,
        ukuranKemeja,
        ukuranCelana,
        jumlahKemeja,
        jumlahCelana,
        keterangan
      ]);
      return await PesananSeragam.findOneBy({ id });
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
          vky_pesanan_seragam_api.generate_pesanan_adm(:nrp, :tahun, :periode);
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
