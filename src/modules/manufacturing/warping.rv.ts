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
import { In } from 'typeorm';
import { ProdWarping } from './entities/warping';
import { ProdWarpingView } from './entities/warping.vw';
import { ProdWarpingInput } from './warping.in';

@Resolver(ProdWarping)
export class ProdWarpingResolver {
  @Query(() => [ProdWarping], { nullable: true })
  @UseMiddleware(isAuth)
  async getProdWarping(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<ProdWarping[] | undefined> {
    try {
      return await ProdWarping.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ProdWarpingView], { nullable: true })
  @UseMiddleware(isAuth)
  async getProdWarpingView(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<ProdWarpingView[] | undefined> {
    try {
      return await ProdWarpingView.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getFyPartNo(@Arg('dopId') dopId: string): Promise<string> {
    try {
      const sql = `SELECT FY_PART_NO as "fyPartNo" FROM JIN_QR_6012_V WHERE DOP_ID = :dopId`;
      const result = await ifs.query(sql, [dopId]);
      return result[0].fyPartNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getCompPart(
    @Arg('partNo') partNo: string,
    @Arg('contract') contract: string
  ): Promise<string> {
    try {
      const sql = `SELECT component_part AS "componentPart"
      FROM   prod_structure
      WHERE  contract = :contract
      AND    part_no = :partno
      AND    eng_chg_level = (SELECT MAX(eng_chg_level)
                              FROM   prod_structure
                              WHERE  contract = :contract
                              AND    part_no = :partno)
      AND    alternative_no = '*'
      AND    bom_type_db = 'M'`;
      const result = await ifs.query(sql, [contract, partNo]);
      return result[0].componentPart;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getJumlahHelaiLusi(@Arg('partDesc') partDesc: string): Promise<string> {
    try {
      const sql = `SELECT SUBSTR(:partDesc, INSTR(:partDesc,' ',-1) + 1) as "jumlahHelaiLusi"
      FROM dual`;
      const result = await ifs.query(sql, [partDesc]);
      return result[0].jumlahHelaiLusi;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getWarnaLusi(@Arg('dopId') dopId: string): Promise<string> {
    try {
      const sql = `SELECT GBR_PROD_WARPING_API.GET_WARNA_LUSI(:dopId) as "warnaLusi" FROM DUAL`;
      const result = await ifs.query(sql, [dopId]);
      return result[0].warnaLusi;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getSettingPerBobin(
    @Arg('site') site: string,
    @Arg('dopId') dopId: string,
    @Arg('qtyOrder') qtyOrder: number
  ): Promise<string> {
    try {
      const sql = `select GBR_PROD_WARPING_API.GET_SETTING_PER_BOBIN(:site, :dopId, :qtyOrder) as "settingBobin" FROM DUAL`;
      const result = await ifs.query(sql, [site, dopId, qtyOrder]);
      return result[0].settingBobin;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getQtyBeamWarping(
    @Arg('site') site: string,
    @Arg('dopId') dopId: string,
    @Arg('qtyOrder') qtyOrder: number
  ): Promise<string> {
    try {
      const sql = `select GBR_PROD_WARPING_API.GET_QTY_BEAM_WARPING(:site, :dopId, :qtyOrder) as "beamWarping" FROM DUAL`;
      const result = await ifs.query(sql, [site, dopId, qtyOrder]);
      return result[0].beamWarping;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getSumQtyPerAssembly(@Arg('orderNo') orderNo: string): Promise<string> {
    try {
      const sql = `select sum(qty_per_assembly) as "qtyPerAssembly" from shop_material_alloc where order_no = :orderNo`;
      const result = await ifs.query(sql, [orderNo]);
      return result[0].qtyPerAssembly;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getMcBenang(@Arg('lotBatchNo') lotBatchNo: string): Promise<string> {
    try {
      const sql = `SELECT REGEXP_SUBSTR (:lotBatchNo,'/{1}([^/]+)', 1, 1,NULL, 1) as "mcBenang" FROM DUAL`;
      const result = await ifs.query(sql, [lotBatchNo]);
      return result[0].mcBenang;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getJumlahBan(
    @Arg('site') site: string,
    @Arg('partNo') partNo: string
  ): Promise<string> {
    try {
      const sql = `SELECT JUMLAH_BAN as "jumlahBan" FROM GBR_MASTER_KP_PART WHERE CONTRACT = :site and PART_NO = :partNo`;
      const result = await ifs.query(sql, [site, partNo]);
      return result[0].jumlahBan;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNetto(
    @Arg('site') site: string,
    @Arg('lotBatchNo') lotBatchNo: string
  ): Promise<number> {
    try {
      const sql = `SELECT SUM(QUANTITY) as "netto" FROM INVENTORY_TRANSACTION_HIST2 WHERE TRANSACTION_CODE = 'OOREC' AND CONTRACT = :site and LOT_BATCH_NO = :lotBatchNo
      and qty_reversed = 0 and rownum = 1`;
      const result = await ifs.query(sql, [site, lotBatchNo]);
      return result[0].netto;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewWarpId(): Promise<number> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_PROD_WARPING`;
      const result = await ifs.query(sql);
      return result[0].id;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarping)
  @UseMiddleware(isAuth)
  async createProdWarping(
    @Arg('input') input: ProdWarpingInput,
    @Ctx() { req }: Context
  ): Promise<ProdWarping> {
    try {
      const data = ProdWarping.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await ProdWarping.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarping, { nullable: true })
  @UseMiddleware(isAuth)
  async updateProdWarping(
    @Arg('input') input: ProdWarpingInput
  ): Promise<ProdWarping> {
    try {
      const data = await ProdWarping.findOneBy({
        id: input.id,
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      ProdWarping.merge(data, { ...input });
      const results = await ProdWarping.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarping)
  @UseMiddleware(isAuth)
  async deleteProdWarping(
    @Arg('id') id: number,
    @Arg('contract') contract: string
  ): Promise<ProdWarping> {
    try {
      const data = await ProdWarping.findOneBy({
        id,
        contract
      });
      if (!data) throw new Error('No data found.');
      await ProdWarping.delete({ id, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
