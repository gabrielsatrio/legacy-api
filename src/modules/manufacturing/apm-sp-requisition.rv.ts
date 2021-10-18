import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { SparePartRequisitionInput } from './apm-sp-requisition.in';
import { SparePartRequisition } from './entities/apm-sp-requisition';
import { SparePartRequisitionView } from './entities/apm-sp-requisition.vw';

@Resolver(SparePartRequisition)
export class SparePartRequisitionResolver {
  @Query(() => [SparePartRequisitionView])
  @UseMiddleware(isAuth)
  async getSPRequisitionsByContract(
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
    @Arg('requisitionId', () => Int) requisitionId: number
  ): Promise<SparePartRequisitionView | undefined> {
    return await SparePartRequisitionView.findOne({ requisitionId });
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getNewSPRequisId(): Promise<number> {
    try {
      const sql = `SELECT ROB_APM_SP_REQUISITION_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await getConnection().query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartRequisition)
  @UseMiddleware(isAuth)
  async createSPRequisition(
    @Arg('input') input: SparePartRequisitionInput,
    @Ctx() { req }: Context
  ): Promise<SparePartRequisition | undefined> {
    try {
      const sql = `SELECT ATJ_EMP_API.Get_Email(:approver) AS "emailAppr" FROM DUAL`;
      const resultForApproverLv1 = await getConnection().query(sql, [
        input.approverLv1
      ]);
      const emaillApprLv1 = resultForApproverLv1[0].emailAppr;
      const resultForApproverLv2 = await getConnection().query(sql, [
        input.approverLv2
      ]);
      const emaillApprLv2 = resultForApproverLv2[0].emailAppr;
      const data = SparePartRequisition.create({
        ...input,
        emaillApprLv1,
        emaillApprLv2,
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
    @Arg('requisitionId', () => Int) requisitionId: number
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
