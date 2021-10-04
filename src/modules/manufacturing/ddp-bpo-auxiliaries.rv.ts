import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
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

  @Mutation(() => BPOAuxiliaries)
  @UseMiddleware(isAuth)
  async createBPOAuxiliaries(
    @Arg('input') input: BPOAuxiliariesInput
  ): Promise<BPOAuxiliaries | undefined> {
    const sql = `
    BEGIN
    CHR_DDT_AUXILIARIES_API.create_BPO_auxiliaries(
        :contract,
        :idNo,
        :partNo,
        :partDesc,
        :partActual,
        :persentase,
        :total,
        :lotBatchNo,
        :lotBatchNo2,
        :orderNo,
        :kuCount,
        :beratAktual,
        :qtyLot,
        :qtyLot2,
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
        input.lotBatchNo2,
        input.orderNo,
        input.kuCount,
        input.beratAktual,
        input.qtyLot,
        input.qtyLot2,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outKuCount = result[2] as number;

    const data = BPOAuxiliaries.findOne({
      contract: outContract,
      idNo: outIdNo,
      kuCount: outKuCount
    });
    return data;
  }

  @Mutation(() => BPOAuxiliaries, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBPOAuxiliaries(
    @Arg('input') input: BPOAuxiliariesInput
  ): Promise<BPOAuxiliaries | undefined> {
    const BPO = await BPOAuxiliaries.findOne({
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
      CHR_DDT_AUXILIARIES_API.update_BPO_auxiliaries(
        :contract,
        :idNo,
        :partNo,
        :partDesc,
        :partActual,
        :persentase,
        :total,
        :lotBatchNo,
        :lotBatchNo2,
        :orderNo,
        :kuCount,
        :beratAktual,
        :qtyLot,
        :qtyLot2,
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
        input.lotBatchNo2,
        input.orderNo,
        input.kuCount,
        input.beratAktual,
        input.qtyLot,
        input.qtyLot2,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
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
    return data;
  }

  @Mutation(() => BPOAuxiliaries)
  @UseMiddleware(isAuth)
  async deleteBPOAuxiliaries(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number,
    @Arg('partNo') partNo: string
  ): Promise<BPOAuxiliaries> {
    try {
      const material = await BPOAuxiliaries.findOne({
        contract,
        idNo,
        kuCount,
        partNo
      });

      if (!material) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      CHR_DDT_AUXILIARIES_API.delete_BPO_auxiliaries(
        :contract,
        :idNo,
        :partNo,
        :kuCount);
      END;
    `;

      await getConnection().query(sql, [contract, idNo, partNo, kuCount]);
      return material;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BPOAuxiliaries)
  @UseMiddleware(isAuth)
  async reserveBPOAuxiliaries(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number,
    @Arg('partNo') partNo: string,
    @Arg('orderNo') orderNo: string,
    @Ctx() { req }: Context
  ): Promise<BPOAuxiliaries> {
    try {
      const material = await BPOAuxiliaries.findOne({
        contract,
        idNo,
        kuCount,
        partNo
      });

      if (!material) {
        throw new Error('No data found.');
      }

      const createdBy: string = req.session.username;
      const sql = `
      BEGIN
      CHR_DDT_AUXILIARIES_API.reserve_auxiliaries(
        :contract,
        :idNo,
        :orderNo,
        :partNo,
        :kuCount,
        :createdBy);
      END;
    `;

      await getConnection().query(sql, [
        contract,
        idNo,
        orderNo,
        partNo,
        kuCount,
        createdBy
      ]);

      return material;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
