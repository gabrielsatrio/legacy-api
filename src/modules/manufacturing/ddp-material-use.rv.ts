import { ifs } from '@/config/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { MaterialUseInput } from './ddp-material-use.in';
import { MaterialUse } from './entities/ddp-material-use';

@Resolver(MaterialUse)
export class MaterialUseResolver {
  @Query(() => [MaterialUse], { nullable: true })
  @UseMiddleware(isAuth)
  async getMaterialUseByKey(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('idNo') idNo: string
  ): Promise<MaterialUse[] | undefined> {
    return await MaterialUse.findBy({ contract: In(contract), idNo });
  }

  @Mutation(() => MaterialUse)
  @UseMiddleware(isAuth)
  async createMaterialUse(
    @Arg('input') input: MaterialUseInput
  ): Promise<MaterialUse | null> {
    const sql = `
    BEGIN
    CHR_DDT_MATERIAL_USE_API.CREATE_MATERIAL_USE(:contract, :idNo, :orderNo,
        :tubeDyeing,
        :no,
        :lotBatchNo,
        :partNo,
        :length,
        :outContract,
        :outIdNo,
        :outNo);
    END;
  `;

    let result;
    try {
      result = await ifs.query(sql, [
        input.contract,
        input.idNo,
        input.orderNo,
        input.tubeDyeing,
        input.no,
        input.lotBatchNo,
        input.partNo,
        input.length,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outNo = result[2] as number;

    const data = MaterialUse.findOneBy({
      contract: outContract,
      idNo: outIdNo,
      no: outNo
    });
    return data;
  }

  @Mutation(() => MaterialUse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMaterialUse(
    @Arg('input') input: MaterialUseInput
  ): Promise<MaterialUse | null> {
    const materialUse = await MaterialUse.findOneBy({
      contract: input.contract,
      idNo: input.idNo,
      no: input.no
    });

    if (!materialUse) {
      throw new Error('No data found.');
    }

    const sql = `
      BEGIN
      CHR_DDT_MATERIAL_USE_API.UPDATE_MATERIAL_USE(:contract, :idNo, :orderNo,
        :tubeDyeing,
        :no,
        :lotBatchNo,
        :partNo,
        :length,
        :outContract,
        :outIdNo,
        :outNo);
    END;
    `;

    let result;

    try {
      result = await ifs.query(sql, [
        input.contract,
        input.idNo,
        input.orderNo,
        input.tubeDyeing,
        input.no,
        input.lotBatchNo,
        input.partNo,
        input.length,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outNo = result[2] as number;

    const data = MaterialUse.findOneBy({
      contract: outContract,
      idNo: outIdNo,
      no: outNo
    });
    return data;
  }

  @Mutation(() => MaterialUse)
  @UseMiddleware(isAuth)
  async deleteMaterialUse(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('no') no: number
  ): Promise<MaterialUse> {
    try {
      const material = await MaterialUse.findOneBy({ contract, idNo, no });

      if (!material) {
        throw new Error('No data found');
      }

      const sql = `
      BEGIN
      CHR_DDT_MATERIAL_USE_API.DELETE_MATERIAL_USE(:contract, :idNo, :no);
      END;
     `;

      await ifs.query(sql, [contract, idNo, no]);

      return material;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
