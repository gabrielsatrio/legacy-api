import { isAuth } from '@/middlewares/is-auth';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from '../../utils/map-error';
import { BPODyestuffInput } from './ddp-bpo-dyestuff.in';
import { BPODyestuff } from './entities/ddp-bpo-dyestuff';

@Resolver(BPODyestuff)
export class BPODyestuffResolver {
  @Query(() => [BPODyestuff], { nullable: true })
  @UseMiddleware(isAuth)
  async getBPODyestuff(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number
  ): Promise<BPODyestuff[] | undefined> {
    return await BPODyestuff.find({
      contract: In(contract),
      idNo,
      kuCount
    });
  }

  @Mutation(() => BPODyestuff)
  @UseMiddleware(isAuth)
  async createBPODyestuff(
    @Arg('input') input: BPODyestuffInput
  ): Promise<BPODyestuff | undefined> {
    const sql = `
    BEGIN
       CHR_DDP_API.create_BPO_dyestuff(
        :contract,
        :idNo,
        :partNo,
        :partDesc,
        :kodeKuans,
        :persentase,
        :total,
        :lotBatchNo,
        :orderNo,
        :kuCount,
        :outContract, :outIdNo, :outKuCount);
    END;
  `;

    let result;

    try {
      result = await getConnection().query(sql, [
        input.contract,
        input.idNo,
        input.partNo,
        input.partDesc,
        input.kodeKuans,
        input.persentase,
        input.total,
        input.lotBatchNo,
        input.orderNo,
        input.kuCount,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err.message));
    }
    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outKuCount = result[2] as number;

    const data = BPODyestuff.findOne({
      contract: outContract,
      idNo: outIdNo,
      kuCount: outKuCount
    });
    return data;
  }

  @Mutation(() => BPODyestuff, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBPODyestuff(
    @Arg('input') input: BPODyestuffInput
  ): Promise<BPODyestuff | undefined> {
    const BPO = await BPODyestuff.findOne({
      contract: input.contract,
      idNo: input.idNo,
      kuCount: input.kuCount,
      partNo: input.partNo
    });

    if (!BPO) {
      throw new Error('No data found.');
    }

    const sql = `
      BEGIN
      CHR_DDP_API.update_BPO_dyestuff(
        :contract,
        :idNo,
        :partNo,
        :partDesc,
        :kodeKuans,
        :persentase,
        :total,
        :lotBatchNo,
        :orderNo,
        :kuCount,
        :outContract, :outIdNo, :outKuCount);
      END;
    `;
    let result;
    try {
      result = await getConnection().query(sql, [
        input.contract,
        input.idNo,
        input.partNo,
        input.partDesc,
        input.kodeKuans,
        input.persentase,
        input.total,
        input.lotBatchNo,
        input.orderNo,
        input.kuCount,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err.message));
    }

    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outKuCount = result[2] as number;

    const data = BPODyestuff.findOne({
      contract: outContract,
      idNo: outIdNo,
      kuCount: outKuCount,
      partNo: input.partNo
    });
    return data;
  }

  @Mutation(() => BPODyestuff)
  @UseMiddleware(isAuth)
  async deleteBPODyestuff(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number,
    @Arg('partNo') partNo: string
  ): Promise<BPODyestuff> {
    try {
      const material = await BPODyestuff.findOne({
        contract,
        idNo,
        kuCount,
        partNo
      });

      if (!material) {
        throw new Error('No data found.');
      }

      await BPODyestuff.delete({ contract, idNo, kuCount, partNo });
      return material;
    } catch (err) {
      throw new Error(mapError(err.message));
    }
  }
}
