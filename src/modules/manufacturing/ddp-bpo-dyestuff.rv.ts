import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { BPODyestuffResponse } from './ddp-bpo-dyestuff.dr';
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
    @Arg('kuCount') kuCount: number,
    @Ctx() { req }: Context
  ): Promise<BPODyestuff[] | undefined> {
    return await BPODyestuff.find({
      contract: In(contract || req.session.defaultSite),
      idNo,
      kuCount
    });
  }

  @Mutation(() => BPODyestuffResponse)
  @UseMiddleware(isAuth)
  async createBPODyestuff(
    @Arg('input') input: BPODyestuffInput
    // @Ctx() { req }: Context
  ): Promise<BPODyestuffResponse | undefined> {
    //const createdBy: string = req.session.userId;

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
      return setErrors(err.message);
    }
    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outKuCount = result[2] as number;

    const data = BPODyestuff.findOne({
      contract: outContract,
      idNo: outIdNo,
      kuCount: outKuCount
    });
    return { success: true, data };
  }

  @Mutation(() => BPODyestuffResponse)
  @UseMiddleware(isAuth)
  async updateBPODyestuff(
    @Arg('input') input: BPODyestuffInput
  ): Promise<BPODyestuffResponse | undefined> {
    const BPO = await BPODyestuff.findOne({
      contract: input.contract,
      idNo: input.idNo,
      kuCount: input.kuCount,
      partNo: input.partNo
    });

    if (!BPO) {
      return undefined;
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
      return setErrors(err.message);
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
    return { success: true, data };
  }

  @Mutation(() => BPODyestuffResponse)
  @UseMiddleware(isAuth)
  async deleteBPODyestuff(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number,
    @Arg('partNo') partNo: string
  ): Promise<BPODyestuffResponse> {
    try {
      const material = await BPODyestuff.findOne({
        contract,
        idNo,
        kuCount,
        partNo
      });

      if (!material) {
        return setErrors('No data found.');
      }

      await BPODyestuff.delete({ contract, idNo, kuCount, partNo });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
