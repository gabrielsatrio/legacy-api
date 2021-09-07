import { isAuth } from '@/middlewares/is-auth';
import oracledb from 'oracledb';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { mapError } from '../../utils/map-error';
import { HeadDyeInput } from './ddp-head-dye.in';
import { HeadDye } from './entities/ddp-head-dye';

@Resolver(HeadDye)
export class HeadDyeResolver {
  @Mutation(() => HeadDye)
  @UseMiddleware(isAuth)
  async createHeadDye(
    @Arg('input') input: HeadDyeInput
  ): Promise<HeadDye | undefined> {
    const sql = `
    BEGIN
    CHR_DDT_MASTER_RESEP_DYE_API.CREATE_RESEP_DYE(:contract, :partNo, :alternate,
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
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;
    const outNo = result[3] as number;

    const data = HeadDye.findOne({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate,
      no: outNo
    });
    return data;
  }

  @Mutation(() => HeadDye, { nullable: true })
  @UseMiddleware(isAuth)
  async updateHeadDye(
    @Arg('input') input: HeadDyeInput
  ): Promise<HeadDye | undefined> {
    const masterResep = await HeadDye.findOne({
      contract: input.contract,
      partNo: input.partNo,
      alternate: input.alternate,
      no: input.no
    });

    if (!masterResep) {
      throw new Error('No data found');
    }

    const sql = `
    BEGIN
    CHR_DDT_MASTER_RESEP_DYE_API.UPDATE_RESEP_DYE(:contract, :partNo, :alternate,
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
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;
    const outNo = result[3] as number;

    const data = HeadDye.findOne({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate,
      no: outNo
    });
    return data;
  }

  @Mutation(() => HeadDye)
  @UseMiddleware(isAuth)
  async deleteHeadDye(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('alternate') alternate: number,
    @Arg('no') no: number
  ): Promise<HeadDye> {
    try {
      const Resep = await HeadDye.findOne({
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
      CHR_DDT_MASTER_RESEP_DYE_API.DELETE_RESEP_DYE(:contract, :partNo, :alternate, :no);
      END;
     `;

      await getConnection().query(sql, [contract, partNo, alternate, no]);
      return Resep;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
