import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { HeadAuxResponse } from './ddp-head-aux.dr';
import { HeadAuxInput } from './ddp-head-aux.in';
import { HeadAux } from './entities/ddp-head-aux';

@Resolver(HeadAux)
export class HeadAuxResolver {
  @Mutation(() => HeadAuxResponse)
  @UseMiddleware(isAuth)
  async createHeadAux(
    @Arg('input') input: HeadAuxInput
    // @Ctx() { req }: Context
  ): Promise<HeadAuxResponse | undefined> {
    //const createdBy: string = req.session.userId;

    const sql = `
    BEGIN
       CHR_DDP_API.CREATE_RESEP_AUX(:contract, :partNo, :alternate,
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

    const data = HeadAux.findOne({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate,
      no: outNo
    });

    if (!data) {
      return setErrors('No data founds.');
    }
    return { success: true, data };
  }

  @Mutation(() => HeadAuxResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateHeadAux(
    @Arg('input') input: HeadAuxInput
  ): Promise<HeadAuxResponse | undefined> {
    const masterResep = await HeadAux.findOne({
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
    CHR_DDP_API.UPDATE_RESEP_AUX(:contract, :partNo, :alternate,
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

    const data = HeadAux.findOne({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate,
      no: outNo
    });
    return { success: true, data };
  }

  @Mutation(() => HeadAuxResponse)
  @UseMiddleware(isAuth)
  async deleteHeadAux(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('alternate') alternate: number,
    @Arg('no') no: number
  ): Promise<HeadAuxResponse> {
    try {
      const Resep = await HeadAux.findOne({
        contract: contract,
        partNo: partNo,
        alternate: alternate,
        no: no
      });

      if (!Resep) {
        return setErrors('No data found.');
      }

      await HeadAux.delete({
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
