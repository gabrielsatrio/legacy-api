import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { SparePartReqLineInput } from './apm-sp-requisition-line.in';
import { SparePartReqLine } from './entities/apm-sp-requisition-line';
import { SparePartReqLineView } from './entities/apm-sp-requisition-line.vw';

@Resolver(SparePartReqLine)
export class SparePartReqLineResolver {
  @Query(() => [SparePartReqLineView])
  @UseMiddleware(isAuth)
  async getSPRequisLinesByReqId(
    @Arg('requisitionId', () => Int) requisitionId: number
  ): Promise<SparePartReqLineView[] | undefined> {
    return await SparePartReqLineView.find({
      where: { requisitionId },
      order: { requisitionId: 'ASC' }
    });
  }

  @Query(() => SparePartReqLineView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSPRequisLine(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<SparePartReqLineView | undefined> {
    return await SparePartReqLineView.findOne({ requisitionId, lineItemNo });
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getNewSPReqLineNo(
    @Arg('requisitionId', () => Int) requistionId: number
  ): Promise<number> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_Line_API.Get_New_Line_No(:requisitionId) AS "newLineNo" FROM DUAL`;
      const result = await getConnection().query(sql, [requistionId]);
      return result[0].newLineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLine)
  @UseMiddleware(isAuth)
  async createSPRequisitionLine(
    @Arg('input') input: SparePartReqLineInput
  ): Promise<SparePartReqLine | undefined> {
    try {
      const data = SparePartReqLine.create({
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const results = await SparePartReqLine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSPRequisitionLine(
    @Arg('input') input: SparePartReqLineInput
  ): Promise<SparePartReqLine | undefined> {
    try {
      const data = await SparePartReqLine.findOne({
        requisitionId: input.requisitionId,
        lineItemNo: input.lineItemNo
      });
      if (!data) throw new Error('No data found.');
      SparePartReqLine.merge(data, input);
      const results = await SparePartReqLine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLine)
  @UseMiddleware(isAuth)
  async deleteSPRequisitionLine(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<SparePartReqLine> {
    try {
      const data = await SparePartReqLine.findOne({
        requisitionId,
        lineItemNo
      });
      if (!data) throw new Error('No data found.');
      await SparePartReqLine.delete({ requisitionId, lineItemNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async isSPReqLineValid(
    @Arg('requisitionId', () => Int) requistionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<boolean> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_Line_API.Is_Valid(:requisitionId, :lineItemNo) AS "isValid" FROM DUAL`;
      const result = await getConnection().query(sql, [
        requistionId,
        lineItemNo
      ]);
      return result[0].isValid === 1 ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
