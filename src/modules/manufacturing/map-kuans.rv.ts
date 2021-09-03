import { isAuth } from '@/middlewares/is-auth';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from '../../utils/map-error';
import { MappingKuans } from './entities/map-kuans';
import { MappingKuansInput } from './map-kuans.in';

@Resolver(MappingKuans)
export class MappingKuansResolver {
  @Query(() => [MappingKuans], { nullable: true })
  @UseMiddleware(isAuth)
  async getMappingKuans(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MappingKuans[] | undefined> {
    return await MappingKuans.find({
      contract: In(contract)
    });
  }

  @Query(() => [MappingKuans], { nullable: true })
  @UseMiddleware(isAuth)
  async getMappingKuan(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('partNo') partNo: string
  ): Promise<MappingKuans[] | undefined> {
    return await MappingKuans.find({
      contract: In(contract),
      partNo
    });
  }

  @Mutation(() => MappingKuans)
  @UseMiddleware(isAuth)
  async createMappingKuans(
    @Arg('input') input: MappingKuansInput
  ): Promise<MappingKuans | undefined> {
    const sql = `
      BEGIN
        CHR_DDP_API.create_mapping_kuans(:contract, :partNo, :rackId, :rackDescription, :activeStatus, :lampNo, :pwdType, :pwdKind, :pwdConc, :colorName, :oldContract, :oldPartNo, :outContract, :outPartNo);
      END;
    `;
    let result;
    try {
      result = await getConnection().query(sql, [
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
      throw new Error(mapError(err.message));
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
  ): Promise<MappingKuans | undefined> {
    const machine = await MappingKuans.findOne({
      contract: input.contract,
      partNo: input.partNo
    });

    if (!machine) {
      throw new Error(mapError('No data found'));
    }

    const sql = `
      BEGIN
      CHR_DDP_API.update_mapping_kuans(:contract, :partNo, :rackId, :rackDescription, :activeStatus, :lampNo, :pwdType, :pwdKind, :pwdConc, :colorName, :oldContract, :oldPartNo, :outContract, :outPartNo);
      END;
    `;

    let result;

    try {
      result = await getConnection().query(sql, [
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
      throw new Error(mapError(err.message));
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;

    const data = await MappingKuans.findOne({
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
      const Resep = await MappingKuans.findOne({
        contract,
        partNo
      });

      if (!Resep) {
        throw new Error(mapError('No data found'));
      }

      await MappingKuans.delete({ contract, partNo });
      return Resep;
    } catch (err) {
      throw new Error(mapError(err.message));
    }
  }
}
