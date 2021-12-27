import { isAuth } from '@/middlewares/is-auth';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from '../../utils/map-error';
import { WindingQC } from './entities/winding-qc';
import { WindingQCInput } from './winding-qc.in';

@Resolver(WindingQC)
export class WindingQCResolver {
  @Query(() => [WindingQC], { nullable: true })
  @UseMiddleware(isAuth)
  async getWindingQC(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<WindingQC[] | undefined> {
    return await WindingQC.find({
      contract: In(contract)
    });
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getStatusLot(
    @Arg('lotBatchNo') lotBatchNo: string
  ): Promise<number | undefined> {
    const currentQuery = `SELECT distinct count(*) as "stat" from CHR_WINDING_QC
                        where lot_batch_no = :lotBatchNo `;
    const isFound = await getConnection().query(currentQuery, [lotBatchNo]);

    return isFound[0].stat;
  }

  @Mutation(() => WindingQC)
  @UseMiddleware(isAuth)
  async createWinding(
    @Arg('input') input: WindingQCInput
  ): Promise<WindingQC | undefined> {
    const sql = `SELECT nvl(max(id_no)+1,1) as "id" from CHR_WINDING_QC`;
    const result = await getConnection().query(sql);

    const currenTRoll = `SELECT nvl(max(roll_no)+1,1) as "id" from CHR_WINDING_QC
                        where trunc(tanggal) = trunc(:tanggal) `;
    const resultRoll = await getConnection().query(currenTRoll, [
      input.tanggal
    ]);
    try {
      const data = WindingQC.create({
        ...input,
        idNo: result[0].id,
        rollNo: resultRoll[0].id
      });
      const results = await WindingQC.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => WindingQC, { nullable: true })
  @UseMiddleware(isAuth)
  async updateWinding(
    @Arg('input') input: WindingQCInput
  ): Promise<WindingQC | undefined | number> {
    try {
      const data = await WindingQC.findOne({
        contract: input.contract,
        idNo: input.idNo
      });
      if (!data) throw new Error('No data found.');
      WindingQC.merge(data, input);
      const results = await WindingQC.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => WindingQC)
  @UseMiddleware(isAuth)
  async deleteWinding(
    @Arg('idNo') idNo: number,
    @Arg('contract') contract: string
  ): Promise<WindingQC> {
    try {
      const data = await WindingQC.findOne({
        idNo,
        contract
      });
      if (!data) throw new Error('No data found.');
      await WindingQC.delete({ idNo, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
