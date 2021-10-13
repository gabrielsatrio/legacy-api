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
import { SparePartReqLineView } from './entities/apm-sp-requisition-line.vw';

@Resolver(SparePartReqLine)
export class SparePartReqLineResolver {
  @Query(() => [SparePartReqLineView])
  @UseMiddleware(isAuth)
  async getAllSPRequisitionLines(
    @Arg('requisitionId') requisitionId: string
  ): Promise<SparePartReqLineView[] | undefined> {
    return await SparePartReqLineView.find({
      where: { requisitionId },
      order: { requisitionId: 'ASC' }
    });
  }

  @Query(() => SparePartReqLineView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSPRequisitionLine(
    @Arg('requisitionId') requisitionId: string,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<SparePartReqLineView | undefined> {
    return await SparePartReqLineView.findOne({ requisitionId, lineItemNo });
  }

  @Mutation(() => SparePartReqLine)
  @UseMiddleware(isAuth)
  async createSPRequisitionLine(
    @Arg('input') input: SparePartReqLineInput
  ): Promise<SparePartReqLine | undefined> {
    try {
      const data = SparePartReqLine.create(input);
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
    @Arg('requisitionId') requisitionId: string,
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
}
