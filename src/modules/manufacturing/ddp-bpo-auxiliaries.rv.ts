import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { BPOAuxiliariesResponse } from './ddp-bpo-auxiliaries.dr';
import { BPOAuxiliariesInput } from './ddp-bpo-auxiliaries.in';
import { BPOAuxiliaries } from './entities/ddp-bpo-auxiliaries';

@Resolver(BPOAuxiliaries)
export class BPOAuxiliariesResolver {
  @Query(() => [BPOAuxiliaries], { nullable: true })
  @UseMiddleware(isAuth)
  async getBPOAuxiliaries(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number
  ): Promise<BPOAuxiliaries[] | undefined> {
    return await BPOAuxiliaries.find({
      contract: In(contract),
      idNo,
      kuCount
    });
  }

  @Mutation(() => BPOAuxiliariesResponse)
  @UseMiddleware(isAuth)
  async createBPOAuxiliaries(
    @Arg('input') input: BPOAuxiliariesInput
    // @Ctx() { req }: Context
  ): Promise<BPOAuxiliariesResponse | undefined> {
    //const createdBy: string = req.session.userId;

    const sql = `
    BEGIN
       CHR_DDP_API.create_BPO_auxiliaries(
        :contract,
        :idNo,
        :partNo,
        :partDesc,
        :partActual,
        :persentase,
        :total,
        :lotBatchNo,
        :orderNo,
        :kuCount,
        :beratAktual,
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
        input.partActual,
        input.persentase,
        input.total,
        input.lotBatchNo,
        input.orderNo,
        input.kuCount,
        input.beratAktual,
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

    const data = BPOAuxiliaries.findOne({
      contract: outContract,
      idNo: outIdNo,
      kuCount: outKuCount
    });
    return { success: true, data };
  }

  @Mutation(() => BPOAuxiliariesResponse)
  @UseMiddleware(isAuth)
  async updateBPOAuxiliaries(
    @Arg('input') input: BPOAuxiliariesInput
  ): Promise<BPOAuxiliariesResponse | undefined> {
    const BPO = await BPOAuxiliaries.findOne({
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
      CHR_DDP_API.update_BPO_auxiliaries(
        :contract,
        :idNo,
        :partNo,
        :partDesc,
        :partActual,
        :persentase,
        :total,
        :lotBatchNo,
        :orderNo,
        :kuCount,
        :beratAktual,
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
        input.partActual,
        input.persentase,
        input.total,
        input.lotBatchNo,
        input.orderNo,
        input.kuCount,
        input.beratAktual,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }

    const outContract = result[0];
    const outIdNo = result[1];
    const outKuCount = result[2];

    const data = BPOAuxiliaries.findOne({
      contract: outContract as string,
      idNo: outIdNo as string,
      kuCount: outKuCount as number,
      partNo: input.partNo
    });
    return { success: true, data };
  }

  @Mutation(() => BPOAuxiliariesResponse)
  @UseMiddleware(isAuth)
  async deleteBPOAuxiliaries(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number,
    @Arg('partNo') partNo: string
  ): Promise<BPOAuxiliariesResponse> {
    try {
      const material = await BPOAuxiliaries.findOne({
        contract,
        idNo,
        kuCount,
        partNo
      });

      if (!material) {
        return setErrors('No data found.');
      }

      await BPOAuxiliaries.delete({ contract, idNo, kuCount, partNo });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
