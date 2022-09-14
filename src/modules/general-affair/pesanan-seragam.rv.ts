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
import { EmployeeMaterializedViewResolver } from './../human-resources/employee-mv.rv';
import { PesananSeragam } from './entities/pesanan-seragam';
import { DefaultSeragamView } from './entities/pesanan-seragam-default.vw';
import { PesananSeragamWarpView } from './entities/pesanan-seragam-warp.vw';
import { PesananSeragamInput } from './pesanan-seragam.in';

@Resolver(PesananSeragam)
export class PesananSeragamResolver {
  @Query(() => [PesananSeragamWarpView])
  @UseMiddleware(isAuth)
  async getAllPesananSeragam(): Promise<PesananSeragamWarpView[] | undefined> {
    try {
      return await PesananSeragamWarpView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [PesananSeragamWarpView])
  @UseMiddleware(isAuth)
  async getPesananSeragam(
    @Arg('deptId', () => String) deptId: string,
    @Arg('plant', () => String) plant: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<PesananSeragamWarpView[] | undefined> {
    try {
      return await PesananSeragamWarpView.findBy({
        deptId,
        contract: plant,
        tahun,
        periode
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async isAdmin(
    @Arg('nrp', () => String) nrp: string
  ): Promise<boolean | undefined> {
    try {
      const data = await ifs.query(
        `
          SELECT vky_pesanan_seragam_api.is_admin(:nrp) as "value"
          FROM   DUAL`,
        [nrp]
      );
      return data[0].value === 1 ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [PesananSeragamWarpView])
  @UseMiddleware(isAuth)
  async getPesananSeragamUser(
    @Arg('nrp', () => String) nrp: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<PesananSeragamWarpView[] | undefined> {
    try {
      const isAdmin = await this.isAdmin(nrp);
      const deptId = await EmployeeMaterializedViewResolver.getDeptId(nrp);
      const companyOffice =
        await EmployeeMaterializedViewResolver.getCompanyOffice(nrp);
      if (!isAdmin) {
        return await PesananSeragamWarpView.findBy({
          nrp: nrp,
          tahun: tahun,
          periode: periode
        });
      } else {
        return await PesananSeragamWarpView.findBy({
          deptId: deptId,
          contract: companyOffice,
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
      const data = await DefaultSeragamView.findOneBy({
        tahun: input.tahun,
        periode: input.periode
      });
      if (!data) throw new Error('Data seragam belum dibuat GA');
      if (data.isLocked) throw new Error('Masa pemesanan seragam sudah habis');
      const exist = await PesananSeragam.findOneBy({
        nrp: input.nrp,
        idJenis: input.idJenis,
        tahun: input.tahun,
        periode: input.periode
      });
      if (exist) throw new Error('Data already exist');
      if (input.idJenis == 1 && input.periode != 1)
        throw new Error('Seragam holding hanya untuk periode 1');
      const result = PesananSeragam.create({ ...input });
      await PesananSeragam.save(result);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PesananSeragam)
  @UseMiddleware(isAuth)
  async updatePesananSeragam(
    @Arg('id', () => Int) id: number,
    @Arg('idJenis', () => Int) idJenis: number,
    @Arg('ukuranKemeja', () => String) ukuranKemeja: string,
    @Arg('ukuranCelana', () => String) ukuranCelana: string,
    @Arg('jumlahKemeja', () => Int) jumlahKemeja: number,
    @Arg('jumlahCelana', () => Int) jumlahCelana: number,
    @Arg('keterangan', () => String) keterangan: string
  ): Promise<PesananSeragam | null> {
    try {
      const data = await PesananSeragam.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      if (data.isLocked) throw new Error('Masa pemesanan seragam sudah habis');
      const sql = `
        BEGIN
          vky_pesanan_seragam_api.update_pesanan_seragam(:id, :idJenis, :ukuranKemeja, :ukuranCelana, :jumlahKemeja, :jumlahCelana, :keterangan);
        END;
      `;
      await ifs.query(sql, [
        id,
        idJenis,
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
      if (data.isLocked) throw new Error('Data already locked by GA');
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async generatePesanan(
    @Arg('nrp', () => String) nrp: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<boolean | undefined> {
    try {
      const data = await DefaultSeragamView.findOneBy({
        tahun,
        periode
      });
      if (!data) throw new Error('Data seragam belum dibuat GA');
      if (data.isLocked) throw new Error('Masa pemesanan seragam sudah habis');
      const sql = `
        BEGIN
          vky_pesanan_seragam_api.generate_pesanan_adm(:nrp, :tahun, :periode);
        END;
      `;
      await ifs.query(sql, [nrp, tahun, periode]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async generatePesananPlant(
    @Arg('plant', () => String) plant: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<boolean | undefined> {
    try {
      const data = await DefaultSeragamView.findOneBy({
        tahun,
        periode
      });
      if (!data) throw new Error('Data seragam belum dibuat GA');
      if (data.isLocked) throw new Error('Masa pemesanan seragam sudah habis');
      const sql = `
      BEGIN
        vky_pesanan_seragam_api.generate_pesanan_plant(:plant, :tahun, :periode);
      END;
      `;
      await ifs.query(sql, [plant, tahun, periode]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async generatePesananEmp(
    @Arg('nrp', () => String) nrp: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<boolean | undefined> {
    try {
      const data = await DefaultSeragamView.findOneBy({
        tahun,
        periode
      });
      if (!data) throw new Error('Data seragam belum dibuat GA');
      if (data.isLocked) throw new Error('Masa pemesanan seragam sudah habis');
      const sql = `
      BEGIN
        vky_pesanan_seragam_api.generate_pesanan(:nrp, :tahun, :periode);
      END;
      `;
      await ifs.query(sql, [nrp, tahun, periode]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
