import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MasterJabatan } from './entities/master-jabatan';
import { MasterJabatanView } from './entities/master-jabatan.vw';
import { MasterJabatanInput } from './master-jabatan.in';

@Resolver(MasterJabatan)
export class MasterJabatanResolver {
  @Query(() => [MasterJabatanView])
  @UseMiddleware(isAuth)
  async getAllMasterJabatan(): Promise<MasterJabatanView[] | undefined> {
    try {
      return await MasterJabatanView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createMasterJabatanPostgre(
    @Arg('input') input: MasterJabatanInput
  ): Promise<boolean | null> {
    try {
      const sql = `begin ang_master_jabatan_api.create__(:kode, :jabatan); end;`;
      await ifs.query(sql, [input.kode, input.jabatan]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateMasterJabatanPostgre(
    @Arg('input') input: MasterJabatanInput
  ): Promise<boolean | null> {
    try {
      const sql = `begin ang_master_jabatan_api.update__(:kode, :jabatan); end;`;
      await ifs.query(sql, [input.kode, input.jabatan]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MasterJabatan)
  @UseMiddleware(isAuth)
  async deleteMasterJabatanPostgre(
    @Arg('kode') kode: string
  ): Promise<MasterJabatan | null> {
    try {
      const sql = `begin ang_master_jabatan_api.delete__(:kode); end;`;
      const data = await MasterJabatan.findOneBy({ kode });
      if (!data) throw new Error('No data found.');
      await ifs.query(sql, [kode]);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
