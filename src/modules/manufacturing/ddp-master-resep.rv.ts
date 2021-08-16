import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { ResepResponse } from './ddp-master-resep.dr';
import { MasterResepInput } from './ddp-master-resep.in';
import { MasterResep } from './entities/ddp-master-resep';

@Resolver(MasterResep)
export class MasterResepResolver {
  @Query(() => [MasterResep], { nullable: true })
  @UseMiddleware(isAuth)
  async getMasterResep(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<MasterResep[] | undefined> {
    return await MasterResep.find({ contract: In(contract) });
  }

  @Query(() => [MasterResep], { nullable: true })
  @UseMiddleware(isAuth)
  async getMasterResepByPart(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('partNo') partNo: string
  ): Promise<MasterResep[] | undefined> {
    return await MasterResep.find({ contract: In(contract), partNo: partNo });
  }

  @Mutation(() => ResepResponse)
  @UseMiddleware(isAuth)
  async createMasterResep(
    @Arg('input') input: MasterResepInput
    // @Ctx() { req }: Context
  ): Promise<ResepResponse | undefined> {
    //const createdBy: string = req.session.userId;

    const sql = `
    BEGIN
       CHR_DDP_API.CREATE_MASTER_RESEP(:contract, :partNo, :alternate,
        :programNo,
        :tanggalCelup,
        :jenis,
        :componentPart,
        :deskripsi,
        :resep,
        :notes,
        :status,
        :outMasterResepId);
    END;
  `;

    let result;
    try {
      result = await getConnection().query(sql, [
        input.contract,
        input.partNo,
        input.alternate,
        input.programNo,
        input.tanggalCelup,
        input.jenis,
        input.componentPart,
        input.deskripsi,
        input.resep,
        input.notes,
        input.status,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }

    const outMasterResepId = result[0] as string;

    console.log(outMasterResepId);

    const data = MasterResep.findOne(outMasterResepId);
    return { success: true, data };
  }

  @Mutation(() => ResepResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMasterResep(
    @Arg('resepId') resepId: number,
    @Arg('input') input: MasterResepInput
  ): Promise<ResepResponse | undefined> {
    const masterResep = await MasterResep.findOne(resepId);

    if (!masterResep) {
      return undefined;
    }

    const sql = `
      BEGIN
      CHR_DDP_API.UPDATE_MASTER_RESEP(:contract, :partNo, :alternate,
        :programNo,
        :tanggalCelup,
        :jenis,
        :componentPart,
        :deskripsi,
        :resep,
        :notes,
        :status,
        :resepId,
        :outMasterResepId);
    END;
    `;

    let result;

    try {
      result = await getConnection().query(sql, [
        input.contract,
        input.partNo,
        input.alternate,
        input.programNo,
        input.tanggalCelup,
        input.jenis,
        input.componentPart,
        input.deskripsi,
        input.resep,
        input.notes,
        input.status,
        resepId,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }

    const outMasterResepId = result[0] as string;

    console.log(outMasterResepId);

    const data = MasterResep.findOne(outMasterResepId);
    return { success: true, data };
  }

  @Mutation(() => ResepResponse)
  @UseMiddleware(isAuth)
  async deleteMasterResep(
    @Arg('resepId') resepId: number
  ): Promise<ResepResponse> {
    try {
      const Resep = await MasterResep.findOne({
        seqId: resepId
      });

      if (!Resep) {
        return setErrors('No data found.');
      }

      await MasterResep.delete({ seqId: resepId });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
