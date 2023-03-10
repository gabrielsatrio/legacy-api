import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { HeadResepInput } from './ddp-head-resep.in';
import { HeadResep } from './entities/ddp-head-resep';

@Resolver(HeadResep)
export class HeadResepResolver {
  @Query(() => [HeadResep], { nullable: true })
  @UseMiddleware(isAuth)
  async getHeadResep(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<HeadResep[] | undefined> {
    return await HeadResep.find({
      relations: { headDyes: true, headAuxs: true },
      where: { contract: In(contract) }
    });
  }

  @Query(() => [HeadResep], { nullable: true })
  @UseMiddleware(isAuth)
  async getHeadResepByPart(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('partNo') partNo: string
  ): Promise<HeadResep[] | undefined> {
    return await HeadResep.find({
      relations: { headDyes: true, headAuxs: true },
      where: {
        contract: In(contract),
        partNo: partNo,
        status: In(['MASTER', 'ACTIVE'])
      }
    });
  }

  @Mutation(() => HeadResep)
  @UseMiddleware(isAuth)
  async createHeadResep(
    @Arg('input') input: HeadResepInput
  ): Promise<HeadResep | null> {
    const sql = `
    BEGIN
    CHR_DDT_MASTER_RESEP_API.CREATE_HEAD_RESEP(:contract, :partNo, :alternate,
        :programNo,
        :tanggalCelup,
        :notes,
        :status,
        :subResep,
        :outContract,
        :outPartNo,
        :outAlternate);
    END;
  `;

    let result;
    try {
      result = await ifs.query(sql, [
        input.contract,
        input.partNo,
        input.alternate,
        input.programNo,
        input.tanggalCelup,
        input.notes,
        input.status,
        input.subResep,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;

    const data = HeadResep.findOneBy({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate
    });
    return data;
  }

  @Mutation(() => HeadResep, { nullable: true })
  @UseMiddleware(isAuth)
  async updateHeadResep(
    @Arg('input') input: HeadResepInput
  ): Promise<HeadResep | null> {
    const masterResep = await HeadResep.findOneBy({
      contract: input.contract,
      partNo: input.partNo,
      alternate: input.alternate
    });

    if (!masterResep) {
      throw new Error('No data found.');
    }

    const sql = `
    BEGIN
    CHR_DDT_MASTER_RESEP_API.UPDATE_HEAD_RESEP(:contract, :partNo, :alternate,
     :programNo,
     :tanggalCelup,
     :notes,
     :status,
     :subResep,
     :outContract,
     :outPartNo,
     :outAlternate);
    END;
    `;

    let result;

    try {
      result = await ifs.query(sql, [
        input.contract,
        input.partNo,
        input.alternate,
        input.programNo,
        input.tanggalCelup,
        input.notes,
        input.status,
        input.subResep,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;

    const data = HeadResep.findOneBy({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate
    });
    return data;
  }

  @Mutation(() => HeadResep)
  @UseMiddleware(isAuth)
  async deleteHeadResep(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('alternate') alternate: number
  ): Promise<HeadResep> {
    try {
      const Resep = await HeadResep.findOneBy({
        contract: contract,
        partNo: partNo,
        alternate: alternate
      });

      if (!Resep) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      CHR_DDT_MASTER_RESEP_API.DELETE_HEAD_RESEP(:contract, :partNo, :alternate);
      END;
     `;

      await ifs.query(sql, [contract, partNo, alternate]);

      return Resep;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
