import { isAuth } from '@/middlewares/is-auth';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from '../../utils/map-error';
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

  @Mutation(() => MasterResep)
  @UseMiddleware(isAuth)
  async createMasterResep(
    @Arg('input') input: MasterResepInput
    // @Ctx() { req }: Context
  ): Promise<MasterResep | undefined> {
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
      throw new Error(mapError(err.message));
    }

    const outMasterResepId = result[0] as string;

    console.log(outMasterResepId);

    const data = MasterResep.findOne(outMasterResepId);
    return data;
  }

  @Mutation(() => MasterResep, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMasterResep(
    @Arg('resepId') resepId: number,
    @Arg('input') input: MasterResepInput
  ): Promise<MasterResep | undefined> {
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
      throw new Error(mapError(err.message));
    }

    const outMasterResepId = result[0] as string;

    console.log(outMasterResepId);

    const data = MasterResep.findOne(outMasterResepId);
    return data;
  }

  @Mutation(() => MasterResep)
  @UseMiddleware(isAuth)
  async deleteMasterResep(
    @Arg('resepId') resepId: number
  ): Promise<MasterResep> {
    try {
      const Resep = await MasterResep.findOne({
        seqId: resepId
      });

      if (!Resep) {
        throw new Error(mapError('No data found.'));
      }

      await MasterResep.delete({ seqId: resepId });
      return Resep;
    } catch (err) {
      throw new Error(mapError(err.message));
    }
  }
}
