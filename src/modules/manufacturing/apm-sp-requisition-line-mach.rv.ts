import { ifs } from '@/database/data-sources';
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
import { SparePartReqLineMachInput } from './apm-sp-requisition-line-mach.in';
import { SparePartReqLineMach } from './entities/apm-sp-requisition-line-mach';
import { SparePartReqLineMachView } from './entities/apm-sp-requisition-line-mach.vw';

@Resolver(SparePartReqLineMach)
export class SparePartReqLineMachResolver {
  @Query(() => [SparePartReqLineMachView])
  @UseMiddleware(isAuth)
  async getSPRequisLineMachsByReqIdLineNo(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('releaseNo', () => Int) releaseNo: number
  ): Promise<SparePartReqLineMachView[] | undefined> {
    try {
      return await SparePartReqLineMachView.find({
        where: { requisitionId, lineItemNo, releaseNo },
        order: {
          requisitionId: 'ASC',
          lineItemNo: 'ASC',
          releaseNo: 'ASC',
          mapNo: 'ASC'
        }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => SparePartReqLineMachView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSPRequisLineMach(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('releaseNo', () => Int) releaseNo: number,
    @Arg('mapNo', () => Int) mapNo: number
  ): Promise<SparePartReqLineMachView | null> {
    try {
      return await SparePartReqLineMachView.findOneBy({
        requisitionId,
        lineItemNo,
        releaseNo,
        mapNo
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getNewSPReqLineMachMapNo(
    @Arg('requisitionId', () => Int) requistionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('releaseNo', () => Int) releaseNo: number
  ): Promise<number> {
    try {
      const sql = `SELECT ROB_APM_SPart_Req_Line_Mac_API.Get_New_Map_No(:requisitionId, :lineItemNo, :releaseNo) AS "newMapNo" FROM DUAL`;
      const result = await ifs.query(sql, [
        requistionId,
        lineItemNo,
        releaseNo
      ]);
      return result[0].newMapNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [SparePartReqLineMachView])
  @UseMiddleware(isAuth)
  async getSPRequisLineMachsByReqId(
    @Arg('requisitionId', () => Int) requisitionId: number
  ): Promise<SparePartReqLineMachView[] | undefined> {
    try {
      return await SparePartReqLineMachView.find({
        where: { requisitionId },
        order: {
          requisitionId: 'ASC',
          lineItemNo: 'ASC',
          releaseNo: 'ASC',
          mapNo: 'ASC'
        }
      });
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
      const existingData = await SparePartReqLineMach.findOneBy({
        requisitionId: input.requisitionId,
        lineItemNo: input.lineItemNo,
        releaseNo: input.releaseNo,
        mapNo: input.mapNo
      });
      if (existingData) throw new Error('Data already exists.');
      const data = SparePartReqLineMach.create({
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const result = await SparePartReqLineMach.save(data);
      return result;
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
      const data = await SparePartReqLineMach.findOneBy({
        requisitionId: input.requisitionId,
        lineItemNo: input.lineItemNo,
        releaseNo: input.releaseNo,
        mapNo: input.mapNo
      });
      if (!data) throw new Error('No data found.');
      SparePartReqLineMach.merge(data, { ...input });
      const result = await SparePartReqLineMach.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLineMach)
  @UseMiddleware(isAuth)
  async deleteSPRequisLineMach(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('releaseNo', () => Int) releaseNo: number,
    @Arg('mapNo', () => Int) mapNo: number
  ): Promise<SparePartReqLineMach> {
    try {
      const data = await SparePartReqLineMach.findOneBy({
        requisitionId,
        lineItemNo,
        releaseNo,
        mapNo
      });
      if (!data) throw new Error('No data found.');
      await SparePartReqLineMach.delete({
        requisitionId,
        lineItemNo,
        releaseNo,
        mapNo
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
