import { ifs } from '@/config/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { MappingKuans } from './entities/map-kuans';
import { MappingKuansInput } from './map-kuans.in';

@Resolver(MappingKuans)
export class MappingKuansResolver {
  @Query(() => [MappingKuans], { nullable: true })
  @UseMiddleware(isAuth)
  async getMappingKuans(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MappingKuans[] | undefined> {
    return await MappingKuans.findBy({
      contract: In(contract)
    });
  }

  @Query(() => [MappingKuans], { nullable: true })
  @UseMiddleware(isAuth)
  async getMappingKuan(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('partNo') partNo: string
  ): Promise<MappingKuans[] | undefined> {
    return await MappingKuans.findBy({
      contract: In(contract),
      partNo
    });
  }

  @Mutation(() => MappingKuans)
  @UseMiddleware(isAuth)
  async createMappingKuans(
    @Arg('input') input: MappingKuansInput
  ): Promise<MappingKuans | null> {
    const sql = `
      BEGIN
      ROB_TRANS_TO_KUAN_MAP_API.create_mapping_kuans(:contract, :partNo, :rackId, :rackDescription, :activeStatus, :lampNo, :pwdType, :pwdKind, :pwdConc, :colorName, :oldContract, :oldPartNo, :outContract, :outPartNo);
      END;
    `;
    let result;
    try {
      result = await ifs.query(sql, [
        input.contract,
        input.partNo,
        input.rackId,
        input.rackDescription,
        input.activeStatus,
        input.lampNo,
        input.pwdType,
        input.pwdKind,
        input.pwdConc,
        input.colorName,
        input.oldContract,
        input.oldPartNo,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;

    const data = await MappingKuans.createQueryBuilder('MK')
      .where('MK.CONTRACT = :contract', { contract: outContract })
      .andWhere('MK.PART_NO = :partNo', { partNo: outPartNo })
      .getOne();

    return data;
  }

  @Mutation(() => MappingKuans)
  @UseMiddleware(isAuth)
  async updateMappingKuans(
    @Arg('input') input: MappingKuansInput
  ): Promise<MappingKuans | null> {
    const machine = await MappingKuans.findOneBy({
      contract: input.contract,
      partNo: input.partNo
    });

    if (!machine) {
      throw new Error('No data found');
    }

    const sql = `
      BEGIN
      ROB_TRANS_TO_KUAN_MAP_API.update_mapping_kuans(:contract, :partNo, :rackId, :rackDescription, :activeStatus, :lampNo, :pwdType, :pwdKind, :pwdConc, :colorName, :oldContract, :oldPartNo, :outContract, :outPartNo);
      END;
    `;

    let result;

    try {
      result = await ifs.query(sql, [
        input.contract,
        input.partNo,
        input.rackId,
        input.rackDescription,
        input.activeStatus,
        input.lampNo,
        input.pwdType,
        input.pwdKind,
        input.pwdConc,
        input.colorName,
        input.oldContract,
        input.oldPartNo,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;

    const data = await MappingKuans.findOneBy({
      contract: outContract,
      partNo: outPartNo
    });

    return data;
  }

  @Mutation(() => MappingKuans)
  @UseMiddleware(isAuth)
  async deleteMappingKuans(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<MappingKuans> {
    try {
      const Resep = await MappingKuans.findOneBy({
        contract,
        partNo
      });

      if (!Resep) {
        throw new Error('No data found');
      }

      const sql = `
      BEGIN
      ROB_TRANS_TO_KUAN_MAP_API.delete_mapping_kuans(:contract, :partNo);
      END;
     `;

      await ifs.query(sql, [contract, partNo]);
      return Resep;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
