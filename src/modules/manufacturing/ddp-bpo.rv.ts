import { isAuth } from '@/middlewares/is-auth';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from '../../utils/map-error';
import { BPOInput } from './ddp-bpo.in';
import { DDPBPO } from './entities/ddp-bpo';

@Resolver(DDPBPO)
export class BPOResolver {
  @Query(() => [DDPBPO], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllBPOs(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<DDPBPO[] | undefined> {
    return await DDPBPO.find({
      relations: ['dyestuffsUses', 'auxiliariesUses'],
      where: { contract: In(contract) }
    });
  }

  @Query(() => DDPBPO, { nullable: true })
  @UseMiddleware(isAuth)
  async getBPO(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number
  ): Promise<DDPBPO | undefined> {
    return await DDPBPO.findOne({
      relations: ['dyestuffsUses', 'auxiliariesUses'],
      where: {
        contract: In(contract),
        idNo,
        kuCount
      }
    });
  }

  @Mutation(() => DDPBPO)
  @UseMiddleware(isAuth)
  async createBPO(@Arg('input') input: BPOInput): Promise<DDPBPO | undefined> {
    const sql = `
    BEGIN
       CHR_DDP_API.create_BPO(
        :idNo,
        :tanggal,
        :partNo,
        :orderNo,
        :noMesin,
        :lotCelup,
        :liquidRatio,
        :volume,
        :weight,
        :altReceipe,
        :programNo,
        :kuCount,
        :sentToAux,
        :contract,
        :jenisKu,
      :outContract, :outIdNo, :outKuCount);
    END;
  `;

    let result;

    try {
      result = await getConnection().query(sql, [
        input.idNo,
        input.tanggal,
        input.partNo,
        input.orderNo,
        input.noMesin,
        input.lotCelup,
        input.liquidRatio,
        input.volume,
        input.weight,
        input.altReceipe,
        input.programNo,
        input.kuCount,
        input.sentToAux,
        input.contract,
        input.jenisKu,
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

    const data = DDPBPO.findOne({
      contract: outContract,
      idNo: outIdNo,
      kuCount: outKuCount
    });
    return data;
  }

  @Mutation(() => DDPBPO, { nullable: true })
  @UseMiddleware(isAuth)
  async UpdateBPO(@Arg('input') input: BPOInput): Promise<DDPBPO | undefined> {
    const BPO = await DDPBPO.findOne({
      contract: input.contract,
      idNo: input.idNo,
      kuCount: input.kuCount
    });

    if (!BPO) {
      throw new Error(mapError('No data found'));
    }

    const sql = `
      BEGIN
      CHR_DDP_API.update_BPO(
        :idNo,
        :tanggal,
        :partNo,
        :orderNo,
        :noMesin,
        :lotCelup,
        :liquidRatio,
        :volume,
        :weight,
        :altReceipe,
        :programNo,
        :kuCount,
        :sentToAux,
        :contract,
        :jenisKu,
      :outContract, :outIdNo, :outKuCount);
      END;
    `;
    let result;
    try {
      result = await getConnection().query(sql, [
        input.idNo,
        input.tanggal,
        input.partNo,
        input.orderNo,
        input.noMesin,
        input.lotCelup,
        input.liquidRatio,
        input.volume,
        input.weight,
        input.altReceipe,
        input.programNo,
        input.kuCount,
        input.sentToAux,
        input.contract,
        input.jenisKu,
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

    const data = DDPBPO.findOne({
      contract: outContract,
      idNo: outIdNo,
      kuCount: outKuCount
    });
    return data;
  }

  @Mutation(() => DDPBPO)
  @UseMiddleware(isAuth)
  async deleteBPO(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number
  ): Promise<DDPBPO> {
    try {
      const material = await DDPBPO.findOne({
        contract,
        idNo,
        kuCount
      });

      if (!material) {
        throw new Error('No data found.');
      }

      await DDPBPO.delete({ contract, idNo, kuCount });
      return material;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
