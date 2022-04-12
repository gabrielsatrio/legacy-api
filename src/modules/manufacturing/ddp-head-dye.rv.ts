import { ifs } from '@/config/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { HeadDyeInput } from './ddp-head-dye.in';
import { HeadDye } from './entities/ddp-head-dye';

@Resolver(HeadDye)
export class HeadDyeResolver {
  @Mutation(() => HeadDye)
  @UseMiddleware(isAuth)
  async createHeadDye(
    @Arg('input') input: HeadDyeInput
  ): Promise<HeadDye | null> {
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
      result = await ifs.query(sql, [
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

    const data = HeadDye.findOneBy({
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
  ): Promise<HeadDye | null> {
    const masterResep = await HeadDye.findOneBy({
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
      result = await ifs.query(sql, [
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

    const data = HeadDye.findOneBy({
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
      const Resep = await HeadDye.findOneBy({
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

      await ifs.query(sql, [contract, partNo, alternate, no]);
      return Resep;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
