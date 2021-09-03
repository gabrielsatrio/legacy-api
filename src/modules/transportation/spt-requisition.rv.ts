import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Requisition } from './entities/spt-requisition';
import { RequisitionView } from './entities/spt-requisition.vw';
import { RequisitionInput } from './spt-requisition.in';

@Resolver(Requisition)
export class RequisitionResolver {
  @Query(() => [Requisition])
  @UseMiddleware(isAuth)
  async getAllRequisitions(): // @Arg('contract', () => [String])
  // contract: string[],
  // @Ctx() { req }: Context
  Promise<Requisition[] | undefined> {
    return Requisition.find();
  }

  @Query(() => [RequisitionView])
  @UseMiddleware(isAuth)
  async getAllRequisitionViews(): // @Arg('contract', () => [String])
  // contract: string[],
  // @Ctx() { req }: Context
  Promise<RequisitionView[] | undefined> {
    return RequisitionView.find();
  }

  @Query(() => Requisition, { nullable: true })
  @UseMiddleware(isAuth)
  async getRequisition(
    @Arg('requisitionId') requisitionId: string
  ): Promise<Requisition | undefined> {
    return await Requisition.findOne(requisitionId);
  }

  @Mutation(() => Requisition)
  @UseMiddleware(isAuth)
  async createRequisition(
    @Arg('input') input: RequisitionInput,
    @Ctx() { req }: Context
  ): Promise<Requisition | undefined> {
    let result;
    const createdBy: string = req.session.userId;
    const sql = `
      BEGIN
        GBR_SPT_API.Create_Requisition(:reqNo, :destinationId, :customerId, :requisitionDate, :rollQty, :weight, :volume, :contract, :createdBy, :outRequisitionNo);
      END;
    `;

    try {
      result = await getConnection().query(sql, [
        input.reqNo,
        input.destinationId,
        input.customerId,
        input.requisitionDate,
        input.rollQty,
        input.weight,
        input.volume,
        input.contract,
        createdBy,
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      console.log('error create req', err);
      throw new Error(mapError(err));
    }
    const outReqNo = result[0] as number;
    const data = Requisition.findOne(outReqNo);
    return data;
  }

  @Mutation(() => Requisition, { nullable: true })
  @UseMiddleware(isAuth)
  async updateRequisition(
    @Arg('input') input: RequisitionInput
  ): Promise<Requisition | undefined> {
    let result;
    const requisition = await Requisition.findOne({
      reqNo: input.reqNo
    });
    if (!requisition) {
      return undefined;
    }
    const sql = `
    BEGIN
      GBR_SPT_API.Update_Requisition(:reqNo, :destinationId, :customerId, :requisitionDate, :rollQty, :weight, :volume, :contract,  :outRequisitionNo);
    END;
  `;
    try {
      result = await getConnection().query(sql, [
        input.reqNo,
        input.destinationId,
        input.customerId,
        input.requisitionDate,
        input.rollQty,
        input.weight,
        input.volume,
        input.contract,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outReqNo = result[0];
    const data = Requisition.findOne({
      reqNo: outReqNo
    });
    return data;
  }

  @Mutation(() => Requisition)
  @UseMiddleware(isAuth)
  async deleteRequisition(
    @Arg('reqNo') reqNo: number
    //@Ctx() { req }: Context
  ): Promise<Requisition> {
    //const createdBy: string = req.session.userId;
    const requisition = await Requisition.findOne({
      reqNo
    });
    if (!requisition) throw new Error('No data found.');
    try {
      await Requisition.delete({ reqNo });
      return requisition;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
