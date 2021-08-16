import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { MappingKuans } from './entities/map-kuans';
import { MappingResponse } from './map-kuans.dr';
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

  @Mutation(() => MappingResponse)
  @UseMiddleware(isAuth)
  async createMappingKuans(
    @Arg('input') input: MappingKuansInput
  ): Promise<MappingResponse | undefined> {
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
      return setErrors(err.message);
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;

    const data = await MappingKuans.createQueryBuilder('MK')
      .where('MK.CONTRACT = :contract', { contract: outContract })
      .andWhere('MK.PART_NO = :partNo', { partNo: outPartNo })
      .getOne();

    return { sucess: true, data };
  }

  @Mutation(() => MappingResponse)
  @UseMiddleware(isAuth)
  async UpdateMappingKuans(
    @Arg('input') input: MappingKuansInput
  ): Promise<MappingResponse | undefined> {
    const machine = await MappingKuans.findOne({
      contract: input.contract,
      partNo: input.partNo
    });

    if (!machine) {
      return undefined;
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
      return setErrors(err.message);
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;

    // const data = await MappingKuans.findOne({
    //   contract: outContract,
    //   partNo: outPartNo
    // });

    const data = await MappingKuans.createQueryBuilder('MK')
      .where('MK.CONTRACT = :contract', { contract: outContract })
      .andWhere('MK.PART_NO = :partNo', { partNo: outPartNo })
      .getOne();
    return { success: true, data };
  }

  @Mutation(() => MappingResponse)
  @UseMiddleware(isAuth)
  async deleteMappingKuans(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<MappingResponse> {
    try {
      const Resep = await MappingKuans.findOne({
        contract,
        partNo
      });

      if (!Resep) {
        return setErrors('No data found.');
      }

      await MappingKuans.delete({ contract, partNo });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
