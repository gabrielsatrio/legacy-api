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
import { SparePartReqLineMachInput } from './apm-sp-requisition-line-mach.in';
import { SparePartReqLineMach } from './entities/apm-sp-requisition-line-mach';
import { SparePartReqLineMachView } from './entities/apm-sp-requisition-line-mach.vw';

@Resolver(SparePartReqLineMach)
export class SparePartReqLineMachResolver {
  @Query(() => [SparePartReqLineMachView])
  @UseMiddleware(isAuth)
  async getSPRequisLineMachsByReqIdLineNo(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: string
  ): Promise<SparePartReqLineMachView[] | undefined> {
    return await SparePartReqLineMachView.find({
      where: { requisitionId, lineItemNo },
      order: { requisitionId: 'ASC' }
    });
  }

  @Query(() => SparePartReqLineMachView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSPRequisLineMach(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('mapNo', () => Int) mapNo: number
  ): Promise<SparePartReqLineMachView | undefined> {
    return await SparePartReqLineMachView.findOne({
      requisitionId,
      lineItemNo,
      mapNo
    });
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getNewSPReqLineMachMapNo(
    @Arg('requisitionId', () => Int) requistionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<number> {
    try {
      const sql = `SELECT ROB_APM_SPart_Req_Line_Mac_API.Get_New_Map_No(:requisitionId, :lineItemNo) AS "newMapNo" FROM DUAL`;
      const result = await getConnection().query(sql, [
        requistionId,
        lineItemNo
      ]);
      return result[0].newMapNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLineMach)
  @UseMiddleware(isAuth)
  async createSPRequisLineMach(
    @Arg('input') input: SparePartReqLineMachInput
  ): Promise<SparePartReqLineMach | undefined> {
    try {
      const data = SparePartReqLineMach.create({
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const results = await SparePartReqLineMach.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLineMach, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSPRequisLineMach(
    @Arg('input') input: SparePartReqLineMachInput
  ): Promise<SparePartReqLineMach | undefined> {
    try {
      const data = await SparePartReqLineMach.findOne({
        requisitionId: input.requisitionId,
        lineItemNo: input.lineItemNo,
        mapNo: input.mapNo
      });
      if (!data) throw new Error('No data found.');
      SparePartReqLineMach.merge(data, input);
      const results = await SparePartReqLineMach.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLineMach)
  @UseMiddleware(isAuth)
  async deleteSPRequisLineMach(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('mapNo', () => Int) mapNo: number
  ): Promise<SparePartReqLineMach> {
    try {
      const data = await SparePartReqLineMach.findOne({
        requisitionId,
        lineItemNo,
        mapNo
      });
      if (!data) throw new Error('No data found.');
      await SparePartReqLineMach.delete({ requisitionId, lineItemNo, mapNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
