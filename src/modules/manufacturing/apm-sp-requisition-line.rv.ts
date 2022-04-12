import { ifs } from '@/config/data-sources';
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
import { SparePartReqLineInput } from './apm-sp-requisition-line.in';
import { SparePartReqLine } from './entities/apm-sp-requisition-line';
import { SparePartReqLineMach } from './entities/apm-sp-requisition-line-mach';
import { SparePartReqLineView } from './entities/apm-sp-requisition-line.vw';

@Resolver(SparePartReqLine)
export class SparePartReqLineResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkSPReqLineValid(
    @Arg('requisitionId', () => Int) requistionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<boolean> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_Line_API.Check_Valid(:requisitionId, :lineItemNo) AS "isValid" FROM DUAL`;
      const result = await ifs.query(sql, [requistionId, lineItemNo]);
      return result[0].isValid === 1 ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

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
  ): Promise<SparePartReqLineView | null> {
    return await SparePartReqLineView.findOneBy({ requisitionId, lineItemNo });
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getNewSPReqLineNo(
    @Arg('requisitionId', () => Int) requistionId: number
  ): Promise<number> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_Line_API.Get_New_Line_No(:requisitionId) AS "newLineNo" FROM DUAL`;
      const result = await ifs.query(sql, [requistionId]);
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
      const result = await SparePartReqLine.save(data);
      return result;
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
      const data = await SparePartReqLine.findOneBy({
        requisitionId: input.requisitionId,
        lineItemNo: input.lineItemNo
      });
      if (!data) throw new Error('No data found.');
      SparePartReqLine.merge(data, { ...input });
      const result = await SparePartReqLine.save(data);
      return result;
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
      const data = await SparePartReqLine.findOneBy({
        requisitionId,
        lineItemNo
      });
      if (!data) throw new Error('No data found.');
      const detailData = await SparePartReqLineMach.findBy({
        requisitionId,
        lineItemNo
      });
      await Promise.all(
        detailData.map(async (item) => {
          try {
            await SparePartReqLineMach.delete({
              requisitionId: item.requisitionId,
              lineItemNo: item.lineItemNo,
              mapNo: item.mapNo
            });
          } catch (err) {
            throw new Error(mapError(err));
          }
        })
      );
      await SparePartReqLine.delete({ requisitionId, lineItemNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
