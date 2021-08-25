import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { HeadDyeResponse } from './ddp-head-dye.dr';
import { HeadDyeInput } from './ddp-head-dye.in';
import { HeadDye } from './entities/ddp-head-dye';

@Resolver(HeadDye)
export class HeadDyeResolver {
  @Mutation(() => HeadDyeResponse)
  @UseMiddleware(isAuth)
  async createHeadDye(
    @Arg('input') input: HeadDyeInput
    // @Ctx() { req }: Context
  ): Promise<HeadDyeResponse | undefined> {
    //const createdBy: string = req.session.userId;

    const sql = `
    BEGIN
       CHR_DDP_API.CREATE_RESEP_DYE(:contract, :partNo, :alternate,
        :componentPart,
        :deskripsi,
        :resep,
        :outContract,
        :outPartNo,
        :outAlternate,
        :outNo);
    END;
  `;

    let result;
    try {
      result = await getConnection().query(sql, [
        input.contract,
        input.partNo,
        input.alternate,
        input.componentPart,
        input.deskripsi,
        input.resep,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;
    const outNo = result[3] as number;

    // console.log(outMasterResepId);

    const data = HeadDye.findOne({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate,
      no: outNo
    });
    return { success: true, data };
  }

  @Mutation(() => HeadDyeResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateHeadDye(
    @Arg('input') input: HeadDyeInput
  ): Promise<HeadDyeResponse | undefined> {
    const masterResep = await HeadDye.findOne({
      contract: input.contract,
      partNo: input.partNo,
      alternate: input.alternate,
      no: input.no
    });

    if (!masterResep) {
      return setErrors('No data found.');
    }

    const sql = `
    BEGIN
    CHR_DDP_API.UPDATE_RESEP_DYE(:contract, :partNo, :alternate,
      :componentPart,
      :deskripsi,
      :resep,
      :no,
      :outContract,
      :outPartNo,
      :outAlternate,
      :outNo);
    END;
    `;

    let result;

    try {
      result = await getConnection().query(sql, [
        input.contract,
        input.partNo,
        input.alternate,
        input.componentPart,
        input.deskripsi,
        input.resep,
        input.no,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;
    const outNo = result[3] as number;

    // console.log(outMasterResepId);

    const data = HeadDye.findOne({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate,
      no: outNo
    });
    return { success: true, data };
  }

  @Mutation(() => HeadDyeResponse)
  @UseMiddleware(isAuth)
  async deleteHeadDye(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('alternate') alternate: number,
    @Arg('no') no: number
  ): Promise<HeadDyeResponse> {
    try {
      const Resep = await HeadDye.findOne({
        contract: contract,
        partNo: partNo,
        alternate: alternate,
        no: no
      });

      if (!Resep) {
        return setErrors('No data found.');
      }

      await HeadDye.delete({
        contract: contract,
        partNo: partNo,
        alternate: alternate,
        no: no
      });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
