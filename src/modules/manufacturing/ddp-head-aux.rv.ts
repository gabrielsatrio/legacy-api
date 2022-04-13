import { ifs } from '@/config/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { HeadAuxInput } from './ddp-head-aux.in';
import { HeadAux } from './entities/ddp-head-aux';

@Resolver(HeadAux)
export class HeadAuxResolver {
  @Mutation(() => HeadAux)
  @UseMiddleware(isAuth)
  async createHeadAux(
    @Arg('input') input: HeadAuxInput
  ): Promise<HeadAux | null> {
    const sql = `
    BEGIN
    CHR_DDT_MASTER_RESEP_AUX_API.CREATE_RESEP_AUX(:contract, :partNo, :alternate,
        :componentPart,
        :deskripsi,
        :resep,
        :pengali,
        :outContract,
        :outPartNo,
        :outAlternate,
        :outNo);
    END;
  `;

    let result;
    try {
      result = await ifs.query(sql, [
        input.contract,
        input.partNo,
        input.alternate,
        input.componentPart,
        input.deskripsi,
        input.resep,
        input.pengali,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;
    const outNo = result[3] as number;

    const data = HeadAux.findOneBy({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate,
      no: outNo
    });

    if (!data) {
      throw new Error('No data found.');
    }
    return data;
  }

  @Mutation(() => HeadAux, { nullable: true })
  @UseMiddleware(isAuth)
  async updateHeadAux(
    @Arg('input') input: HeadAuxInput
  ): Promise<HeadAux | null> {
    const masterResep = await HeadAux.findOneBy({
      contract: input.contract,
      partNo: input.partNo,
      alternate: input.alternate,
      no: input.no
    });

    if (!masterResep) {
      throw new Error('No data found.');
    }

    const sql = `
    BEGIN
    CHR_DDT_MASTER_RESEP_AUX_API.UPDATE_RESEP_AUX(:contract, :partNo, :alternate,
      :componentPart,
      :deskripsi,
      :resep,
      :no,
      :pengali,
      :outContract,
      :outPartNo,
      :outAlternate,
      :outNo);
    END;
    `;

    let result;

    try {
      result = await ifs.query(sql, [
        input.contract,
        input.partNo,
        input.alternate,
        input.componentPart,
        input.deskripsi,
        input.resep,
        input.no,
        input.pengali,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;
    const outNo = result[3] as number;

    const data = HeadAux.findOneBy({
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
      const Resep = await HeadAux.findOneBy({
        contract: contract,
        partNo: partNo,
        alternate: alternate,
        no: no
      });

      if (!Resep) {
        throw new Error('No data found');
      }

      const sql = `
      BEGIN
      CHR_DDT_MASTER_RESEP_AUX_API.DELETE_RESEP_AUX(:contract, :partNo, :alternate, :no);
      END;
     `;

      await ifs.query(sql, [contract, partNo, alternate, no]);

      return Resep;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
