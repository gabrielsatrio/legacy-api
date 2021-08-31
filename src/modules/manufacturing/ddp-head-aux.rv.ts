import { isAuth } from '@/middlewares/is-auth';
import oracledb from 'oracledb';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { mapError } from '../../utils/map-error';
import { HeadAuxInput } from './ddp-head-aux.in';
import { HeadAux } from './entities/ddp-head-aux';

@Resolver(HeadAux)
export class HeadAuxResolver {
  @Mutation(() => HeadAux)
  @UseMiddleware(isAuth)
  async createHeadAux(
    @Arg('input') input: HeadAuxInput
    // @Ctx() { req }: Context
  ): Promise<HeadAux | undefined> {
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
      throw new Error(mapError(err.message));
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
      throw new Error(mapError('No data found.'));
    }
    return data;
  }

  @Mutation(() => HeadAux, { nullable: true })
  @UseMiddleware(isAuth)
  async updateHeadAux(
    @Arg('input') input: HeadAuxInput
  ): Promise<HeadAux | undefined> {
    const masterResep = await HeadAux.findOne({
      contract: input.contract,
      partNo: input.partNo,
      alternate: input.alternate,
      no: input.no
    });

    if (!masterResep) {
      throw new Error(mapError('No data found.'));
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
      throw new Error(mapError(err.message));
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
    return data;
  }

  @Mutation(() => HeadAux)
  @UseMiddleware(isAuth)
  async deleteHeadAux(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('alternate') alternate: number,
    @Arg('no') no: number
  ): Promise<HeadAux> {
    try {
      const Resep = await HeadAux.findOne({
        contract: contract,
        partNo: partNo,
        alternate: alternate,
        no: no
      });

      if (!Resep) {
        throw new Error(mapError('No data found'));
      }

      await HeadAux.delete({
        contract: contract,
        partNo: partNo,
        alternate: alternate,
        no: no
      });
      return Resep;
    } catch (err) {
      throw new Error(mapError(err.message));
    }
  }
}
