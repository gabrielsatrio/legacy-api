import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { BPOResponse } from './ddp-bpo.dr';
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

  @Mutation(() => BPOResponse)
  @UseMiddleware(isAuth)
  async createBPO(
    @Arg('input') input: BPOInput
  ): Promise<BPOResponse | undefined> {
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
      return setErrors(err.message);
    }
    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outKuCount = result[2] as number;

    const data = DDPBPO.findOne({
      contract: outContract,
      idNo: outIdNo,
      kuCount: outKuCount
    });
    return { success: true, data };
  }

  @Mutation(() => BPOResponse)
  @UseMiddleware(isAuth)
  async UpdateBPO(
    @Arg('input') input: BPOInput
  ): Promise<BPOResponse | undefined> {
    const BPO = await DDPBPO.findOne({
      contract: input.contract,
      idNo: input.idNo,
      kuCount: input.kuCount
    });

    if (!BPO) {
      return undefined; //setErrors(errorMessageLibrary(1));
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
      return setErrors(err.message);
    }

    const outContract = result[0] as string;
    const outIdNo = result[1] as string;
    const outKuCount = result[2] as number;

    const data = DDPBPO.findOne({
      contract: outContract,
      idNo: outIdNo,
      kuCount: outKuCount
    });
    return { success: true, data };
  }

  @Mutation(() => BPOResponse)
  @UseMiddleware(isAuth)
  async deleteBPO(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string,
    @Arg('kuCount') kuCount: number
  ): Promise<BPOResponse> {
    try {
      const material = await DDPBPO.findOne({
        contract,
        idNo,
        kuCount
      });

      if (!material) {
        return setErrors('No data found.');
      }

      await DDPBPO.delete({ contract, idNo, kuCount });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
