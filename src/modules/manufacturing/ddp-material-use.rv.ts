import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { MaterialUseResponse } from './ddp-material-use.dr';
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
    return await MaterialUse.find({ contract: In(contract), idNo });
  }

  @Mutation(() => MaterialUseResponse)
  @UseMiddleware(isAuth)
  async createMaterialUse(
    @Arg('input') input: MaterialUseInput
  ): Promise<MaterialUseResponse | undefined> {
    const sql = `
    BEGIN
       CHR_DDP_API.CREATE_MATERIAL_USE(:contract, :idNo, :orderNo,
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
      result = await getConnection().query(sql, [
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
      return setErrors(err.message);
    }

    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outNo = result[2] as number;

    const data = MaterialUse.findOne({
      contract: outContract,
      idNo: outIdNo,
      no: outNo
    });
    return { success: true, data };
  }

  @Mutation(() => MaterialUseResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMaterialUse(
    @Arg('input') input: MaterialUseInput
  ): Promise<MaterialUseResponse | undefined> {
    const materialUse = await MaterialUse.findOne({
      contract: input.contract,
      idNo: input.idNo,
      no: input.no
    });

    if (!materialUse) {
      return undefined;
    }

    const sql = `
      BEGIN
      CHR_DDP_API.UPDATE_MATERIAL_USE(:contract, :idNo, :orderNo,
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
      result = await getConnection().query(sql, [
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
      return setErrors(err.message);
    }

    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outNo = result[2] as number;

    const data = MaterialUse.findOne({
      contract: outContract,
      idNo: outIdNo,
      no: outNo
    });
    return { success: true, data };
  }

  @Mutation(() => MaterialUseResponse)
  @UseMiddleware(isAuth)
  async deleteMaterialUse(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('no') no: number
  ): Promise<MaterialUseResponse> {
    try {
      const material = await MaterialUse.findOne({ contract, idNo, no });

      if (!material) {
        return setErrors('No data found.');
      }

      await MaterialUse.delete({ contract, idNo, no });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
