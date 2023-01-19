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
import { In } from 'typeorm';
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
      return await PesananSeragamWarpView.find({ order: { id: 'DESC' } });
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

  @Query(() => [PesananSeragamWarpView])
  @UseMiddleware(isAuth)
  async getPesananSeragamBySite(
    @Arg('site', () => [String]) site: string[]
  ): Promise<PesananSeragamWarpView[] | undefined> {
    try {
      return await PesananSeragamWarpView.findBy({ contract: In(site) });
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
    @Arg('contract', () => [String]) contract: string[],
    @Arg('departmentId', () => [String])
    departmentId: string[],
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<PesananSeragamWarpView[] | undefined> {
    try {
      if (contract[0] === 'null' && departmentId[0] === 'null')
        return await PesananSeragamWarpView.findBy({ nrp });
      else
        return await PesananSeragamWarpView.findBy({
          contract: In(contract),
          deptId: In(departmentId),
          tahun,
          periode
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
    @Arg('keterangan', () => String) keterangan: string,
    @Arg('createdBy', () => String) createdBy: string
  ): Promise<PesananSeragam | null> {
    try {
      const data = await PesananSeragam.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      if (data.isLocked) throw new Error('Masa pemesanan seragam sudah habis');
      const sql = `
        BEGIN
          vky_pesanan_seragam_api.update_pesanan_seragam(:id, :idJenis, :ukuranKemeja, :ukuranCelana, :jumlahKemeja, :jumlahCelana, :keterangan, :createdBy);
        END;
      `;
      await ifs.query(sql, [
        id,
        idJenis,
        ukuranKemeja,
        ukuranCelana,
        jumlahKemeja,
        jumlahCelana,
        keterangan,
        createdBy
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
        periode,
        tahun
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
        periode,
        tahun
      });
      if (!data) throw new Error('Data not exist!');
      await PesananSeragam.createQueryBuilder()
        .update('PesananSeragam')
        .set({ isLocked: false })
        .where('TAHUN = :tahun AND PERIODE = :periode', {
          tahun,
          periode
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
    @Arg('sites', () => [String]) sites: string[],
    @Arg('departments', () => [String]) departents: string[],
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

      let sql = `
        BEGIN
          vky_pesanan_seragam_api.generate_pesanan(:nrp, :tahun, :periode, :createdBy);
        END;
      `;
      if (sites[0] === 'null' && departents[0] === 'null') {
        await ifs.query(sql, [nrp, tahun, periode, nrp]);
      } else {
        sql = `
          BEGIN
            vky_pesanan_seragam_api.generate_pesanan_dept(:site, :departmentId, :tahun, :periode, :createdBy);
          END;
        `;
        await sites.forEach((site) => {
          departents.forEach((department) => {
            ifs.query(sql, [site, department, tahun, periode, nrp]);
          });
        });
      }
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async generatePesananSite(
    @Arg('site', () => String) site: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number,
    @Arg('createdBy', () => String) createdBy: string
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
        vky_pesanan_seragam_api.generate_pesanan_plant(:site, :tahun, :periode, :createdBy);
      END;
      `;
      await ifs.query(sql, [site, tahun, periode, createdBy]);
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
    @Arg('periode', () => Int) periode: number,
    @Arg('createdBy', () => String) createdBy: string
  ): Promise<boolean | undefined> {
    try {
      const data = await DefaultSeragamView.findOneBy({
        tahun,
        periode
      });
      if (!data) throw new Error('Data seragam belum dibuat GA');
      if (data.isLocked) throw new Error('Masa pemesanan seragam sudah habis');

      const isGetSeragam = await ifs.query(
        `
        SELECT VKY_PESANAN_SERAGAM_API.IS_GET_SERAGAM(:nrp) as "value"
        FROM dual
      `,
        [nrp]
      );
      if (isGetSeragam[0].value === 0)
        throw new Error('Belum dapat memesan seragam');

      const sql = `
      BEGIN
        vky_pesanan_seragam_api.generate_pesanan(:nrp, :tahun, :periode, :createdBy);
      END;
      `;
      await ifs.query(sql, [nrp, tahun, periode, createdBy]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async generatePesananDept(
    @Arg('site', () => String) site: string,
    @Arg('departmentId', () => String) departentId: string,
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number,
    @Arg('createdBy', () => String) createdBy: string
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
        vky_pesanan_seragam_api.generate_pesanan_dept(:site, :departmentId, :tahun, :periode, :createdBy);
      END;
      `;
      await ifs.query(sql, [site, departentId, tahun, periode, createdBy]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
