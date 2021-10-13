import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { SparePartRequisitionInput } from './apm-sp-requisition.in';
import { SparePartRequisition } from './entities/apm-sp-requisition';
import { SparePartRequisitionView } from './entities/apm-sp-requisition.vw';

@Resolver(SparePartRequisition)
export class SparePartRequisitionResolver {
  @Query(() => [SparePartRequisitionView])
  @UseMiddleware(isAuth)
  async getAllSPRequisitions(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<SparePartRequisitionView[] | undefined> {
    return await SparePartRequisitionView.find({
      where: { contract: In(contract) },
      order: { requisitionId: 'ASC' }
    });
  }

  @Query(() => SparePartRequisitionView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSPRequisition(
    @Arg('requisitionId') requisitionId: string
  ): Promise<SparePartRequisitionView | undefined> {
    return await SparePartRequisitionView.findOne({ requisitionId });
  }

  @Mutation(() => SparePartRequisition)
  @UseMiddleware(isAuth)
  async createSPRequisition(
    @Arg('input') input: SparePartRequisitionInput,
    @Ctx() { req }: Context
  ): Promise<SparePartRequisition | undefined> {
    try {
      const data = SparePartRequisition.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const results = await SparePartRequisition.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartRequisition, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSPRequisition(
    @Arg('input') input: SparePartRequisitionInput
  ): Promise<SparePartRequisition | undefined> {
    try {
      const data = await SparePartRequisition.findOne({
        requisitionId: input.requisitionId
      });
      if (!data) throw new Error('No data found.');
      SparePartRequisition.merge(data, input);
      const results = await SparePartRequisition.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartRequisition)
  @UseMiddleware(isAuth)
  async deleteSPRequisition(
    @Arg('requisitionId') requisitionId: string
  ): Promise<SparePartRequisition> {
    try {
      const data = await SparePartRequisition.findOne({ requisitionId });
      if (!data) throw new Error('No data found.');
      await SparePartRequisition.delete({ requisitionId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
