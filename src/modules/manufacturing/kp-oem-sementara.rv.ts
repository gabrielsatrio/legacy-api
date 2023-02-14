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
import { KpOemSementara } from './entities/kp-oem-sementara';
import { KpOemSementaraView } from './entities/kp-oem-sementara.vw';
import { KpOemSementaraInput } from './kp-oem-sementara.in';

@Resolver(KpOemSementara)
export class KpSementaraOemResolver {
  @Query(() => [KpOemSementaraView])
  @UseMiddleware(isAuth)
  async getKpOemSementara(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('command', () => Boolean) command: boolean
  ): Promise<KpOemSementaraView[] | undefined> {
    try {
      if (command)
        return await KpOemSementaraView.findBy({ contract: In(contract) });
      else
        return await KpOemSementaraView.findBy({
          contract: In(contract),
          status: 'Created'
        });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => KpOemSementaraView, { nullable: true })
  @UseMiddleware(isAuth)
  async getKpOemSementaraByLot(
    @Arg('lotBatchNo', () => String) lotBatchNo: string
  ): Promise<KpOemSementaraView | null> {
    try {
      return await KpOemSementaraView.findOneBy({ lotBatchNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async generateLotBatchSementara(
    @Arg('contract', () => String) contract: string
  ): Promise<string | null> {
    try {
      const sql = `
        SELECT vky_kp_oem_sementara_api.generate_lot_batch_sementara( :contract) as "lotBatchNo"
        FROM   DUAL
      `;

      const result = await ifs.query(sql, [contract]);
      return result[0].lotBatchNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getPickAkhir(
    @Arg('contract', () => String) contract: string,
    @Arg('orderNo', () => String) orderNo: string
  ): Promise<number> {
    try {
      const sql = `
        SELECT vky_kp_oem_sementara_api.get_pick_akhir( :contract, :orderNo) AS "pickAkhir"
        FROM   DUAL
      `;
      const result = await ifs.query(sql, [contract, orderNo]);
      return result[0].pickAkhir;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createKpOemSementara(
    @Arg('contract', () => String) contract: string,
    @Arg('orderNo', () => String) orderNo: string,
    @Arg('seriBeam', () => String) seriBeam: string,
    @Arg('pickAwal', () => Int) pickAwal: number,
    @Arg('pickAkhir', () => Int) pickAkhir: number,
    @Arg('createdAt', () => String) createdAt: string
  ): Promise<boolean | null> {
    try {
      const exist = await KpOemSementaraView.findOneBy({
        contract,
        orderNo,
        pickAwal,
        pickAkhir
      });
      if (exist) throw new Error('Data already exist!');
      if (pickAwal >= pickAkhir)
        throw new Error('Pick akhir harus lebih besar dari pick awal');
      if ((await this.getPickAkhir(contract, orderNo)) > pickAwal)
        throw new Error('Pick awal harus lebih besar dari pick sebelumnya');
      const sql = `
        BEGIN
          vky_kp_oem_sementara_api.insert__(:contract, :orderNo, :seriBeam, :pickAwal, :pickAkhir, :createdAt);
        END;
      `;
      await ifs.query(sql, [
        contract,
        orderNo,
        seriBeam,
        pickAwal,
        pickAkhir,
        createdAt
      ]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => KpOemSementara)
  @UseMiddleware(isAuth)
  async updateKpOemSementara(
    @Arg('input') input: KpOemSementaraInput
  ): Promise<KpOemSementara | null> {
    try {
      const data = await KpOemSementara.findOneBy({
        lotBatchNo: input.lotBatchNo
      });
      if (!data) throw new Error('Data not exist!');
      KpOemSementara.merge(data, { ...input });
      const result = await KpOemSementara.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async issueKpOemSementara(
    @Arg('lotBatchNo', () => String) lotBatchNo: string
  ): Promise<boolean | null> {
    try {
      const data = await KpOemSementaraView.findOneBy({ lotBatchNo });
      if (!data) throw new Error('Data not exist!');
      const sql = `
        BEGIN
          vky_kp_oem_sementara_api.issue__(:lotBatchNo);
        END;
      `;
      await ifs.query(sql, [lotBatchNo]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async unissueKpOemSementara(
    @Arg('lotBatchNo', () => String) lotBatchNo: string
  ): Promise<boolean | null> {
    try {
      const data = await KpOemSementaraView.findOneBy({ lotBatchNo });
      if (!data) return false;
      const sql = `
        BEGIN
          vky_kp_oem_sementara_api.unissue__(:lotBatchNo);
        END;
      `;
      await ifs.query(sql, [lotBatchNo]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
