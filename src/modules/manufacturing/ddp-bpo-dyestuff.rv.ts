import { ifs } from '@/config/data-sources';
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
import { In } from 'typeorm';
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
    return await BPODyestuff.findBy({
      contract: In(contract),
      idNo,
      kuCount
    });
  }

  @Mutation(() => BPODyestuff)
  @UseMiddleware(isAuth)
  async createBPODyestuff(
    @Arg('input') input: BPODyestuffInput
  ): Promise<BPODyestuff | null> {
    const sql = `
    BEGIN
    CHR_DDT_DYESTUFF_API.create_BPO_dyestuff(
        :contract,
        :idNo,
        :partNo,
        :partDesc,
        :kodeKuans,
        :persentase,
        :total,
        :lotBatchNo,
        :lotBatchNo2,
        :orderNo,
        :kuCount,
        :qtyLot,
        :qtyLot2,
        :outContract, :outIdNo, :outKuCount);
    END;
  `;

    let result;

    try {
      result = await ifs.query(sql, [
        input.contract,
        input.idNo,
        input.partNo,
        input.partDesc,
        input.kodeKuans,
        input.persentase,
        input.total,
        input.lotBatchNo,
        input.lotBatchNo2,
        input.orderNo,
        input.kuCount,
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

    const data = BPODyestuff.findOneBy({
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
  ): Promise<BPODyestuff | null> {
    const BPO = await BPODyestuff.findOneBy({
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
      CHR_DDT_DYESTUFF_API.update_BPO_dyestuff(
        :contract,
        :idNo,
        :partNo,
        :partDesc,
        :kodeKuans,
        :persentase,
        :total,
        :lotBatchNo,
        :lotBatchNo2,
        :orderNo,
        :kuCount,
        :qtyLot,
        :qtyLot2,
        :outContract, :outIdNo, :outKuCount);
      END;
    `;
    let result;
    try {
      result = await ifs.query(sql, [
        input.contract,
        input.idNo,
        input.partNo,
        input.partDesc,
        input.kodeKuans,
        input.persentase,
        input.total,
        input.lotBatchNo,
        input.lotBatchNo2,
        input.orderNo,
        input.kuCount,
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

    const data = BPODyestuff.findOneBy({
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
      const material = await BPODyestuff.findOneBy({
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
      CHR_DDT_DYESTUFF_API.delete_BPO_dyestuff(
        :contract,
        :idNo,
        :partNo,
        :kuCount);
      END;
    `;

      await ifs.query(sql, [contract, idNo, partNo, kuCount]);

      return material;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BPODyestuff)
  @UseMiddleware(isAuth)
  async reserveBPODyestuff(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number,
    @Arg('partNo') partNo: string,
    @Arg('orderNo') orderNo: string,
    @Ctx() { req }: Context
  ): Promise<BPODyestuff> {
    try {
      const material = await BPODyestuff.findOneBy({
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
      CHR_DDT_DYESTUFF_API.reserve_dyestuff(
        :contract,
        :idNo,
        :orderNo,
        :partNo,
        :kuCount,
        :createdBy);
      END;
    `;

      await ifs.query(sql, [
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
