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
  async getAllSPRequisLineMachs(
    @Arg('requisitionId') requisitionId: string,
    @Arg('lineItemNo') lineItemNo: string
  ): Promise<SparePartReqLineMachView[] | undefined> {
    return await SparePartReqLineMachView.find({
      where: { requisitionId, lineItemNo },
      order: { requisitionId: 'ASC' }
    });
  }

  @Query(() => SparePartReqLineMachView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSPRequisLineMach(
    @Arg('requisitionId') requisitionId: string,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('mapNo', () => Int) mapNo: number
  ): Promise<SparePartReqLineMachView | undefined> {
    return await SparePartReqLineMachView.findOne({
      requisitionId,
      lineItemNo,
      mapNo
    });
  }

  @Mutation(() => SparePartReqLineMach)
  @UseMiddleware(isAuth)
  async createSPRequisLineMach(
    @Arg('input') input: SparePartReqLineMachInput
  ): Promise<SparePartReqLineMach | undefined> {
    try {
      const data = SparePartReqLineMach.create(input);
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
    @Arg('requisitionId') requisitionId: string,
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
