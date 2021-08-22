import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { HeadResepResponse } from './ddp-head-resep.dr';
import { HeadResepInput } from './ddp-head-resep.in';
import { HeadResep } from './entities/ddp-head-resep';
import { MasterResep } from './entities/ddp-master-resep';

@Resolver(HeadResep)
export class HeadResepResolver {
  @Query(() => [HeadResep], { nullable: true })
  @UseMiddleware(isAuth)
  async getHeadResep(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<HeadResep[] | undefined> {
    return await HeadResep.find({ contract: In(contract) });
  }

  @Query(() => [HeadResep], { nullable: true })
  @UseMiddleware(isAuth)
  async getHeadResepByPart(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('partNo') partNo: string
  ): Promise<HeadResep[] | undefined> {
    return await HeadResep.find({ contract: In(contract), partNo: partNo });
  }

  @Mutation(() => HeadResepResponse)
  @UseMiddleware(isAuth)
  async createHeadResep(
    @Arg('input') input: HeadResepInput
    // @Ctx() { req }: Context
  ): Promise<HeadResepResponse | undefined> {
    //const createdBy: string = req.session.userId;

    const sql = `
    BEGIN
       CHR_DDP_API.CREATE_HEAD_RESEP(:contract, :partNo, :alternate,
        :programNo,
        :tanggalCelup,
        :notes,
        :status,
        :outContract,
        :outPartNo,
        :outAlternate);
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
        input.notes,
        input.status,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;

    // console.log(outMasterResepId);

    const data = HeadResep.findOne({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate
    });
    return { success: true, data };
  }

  @Mutation(() => HeadResepResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateHeadResep(
    @Arg('input') input: HeadResepInput
  ): Promise<HeadResepResponse | undefined> {
    const masterResep = await MasterResep.findOne({
      contract: input.contract,
      partNo: input.partNo,
      alternate: input.alternate
    });

    if (!masterResep) {
      return undefined;
    }

    const sql = `
    BEGIN
    CHR_DDP_API.UPDATE_HEAD_RESEP(:contract, :partNo, :alternate,
     :programNo,
     :tanggalCelup,
     :notes,
     :status,
     :outContract,
     :outPartNo,
     :outAlternate);
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
        input.notes,
        input.status,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }

    const outContract = result[0] as string;
    const outPartNo = result[1] as string;
    const outAlternate = result[2] as number;

    // console.log(outMasterResepId);

    const data = HeadResep.findOne({
      contract: outContract,
      partNo: outPartNo,
      alternate: outAlternate
    });
    return { success: true, data };
  }

  @Mutation(() => HeadResepResponse)
  @UseMiddleware(isAuth)
  async deleteHeadResep(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('alternate') alternate: number
  ): Promise<HeadResepResponse> {
    try {
      const Resep = await HeadResep.findOne({
        contract: contract,
        partNo: partNo,
        alternate: alternate
      });

      if (!Resep) {
        return setErrors('No data found.');
      }

      await HeadResep.delete({
        contract: contract,
        partNo: partNo,
        alternate: alternate
      });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
