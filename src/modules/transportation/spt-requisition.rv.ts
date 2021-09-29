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
import { RequisitionSplitInput } from './spt-requisition-split.in';
import { RequisitionInput } from './spt-requisition.in';

@Resolver(Requisition)
export class RequisitionResolver {
  @Query(() => [Requisition])
  @UseMiddleware(isAuth)
  async getAllRequisitions(): Promise<Requisition[] | undefined> {
    return await Requisition.find();
  }

  @Query(() => [RequisitionView])
  @UseMiddleware(isAuth)
  async getAllRequisitionViews(): Promise<RequisitionView[] | undefined> {
    return await RequisitionView.find();
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
    try {
      const createdBy: string = req.session.username;
      const sql = `
      BEGIN
        GBR_SPT_API.Create_Requisition(:reqNo, :destinationId, :customerId, :requisitionDate, :rollQty, :meter, :weight, :volume, :contract, :notes, :createdBy, :outRequisitionNo);
      END;
    `;
      const result = await getConnection().query(sql, [
        input.reqNo,
        input.destinationId,
        input.customerId,
        input.requisitionDate,
        input.rollQty,
        input.meter,
        input.weight,
        input.volume,
        input.contract,
        input.notes,
        createdBy,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outReqNo = result[0] as number;
      const data = Requisition.findOne(outReqNo);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Requisition, { nullable: true })
  @UseMiddleware(isAuth)
  async updateRequisition(
    @Arg('input') input: RequisitionInput
  ): Promise<Requisition | undefined> {
    try {
      const requisition = await Requisition.findOne({ reqNo: input.reqNo });
      if (!requisition) throw new Error('No data found');
      const sql = `
    BEGIN
      GBR_SPT_API.Update_Requisition(:reqNo, :destinationId, :customerId, :requisitionDate, :rollQty, :meter, :weight, :volume, :contract, :notes,  :outRequisitionNo);
    END;
  `;
      const result = await getConnection().query(sql, [
        input.reqNo,
        input.destinationId,
        input.customerId,
        input.requisitionDate,
        input.rollQty,
        input.meter,
        input.weight,
        input.volume,
        input.contract,
        input.notes,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outReqNo = result[0];
      const data = Requisition.findOne({ reqNo: outReqNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Requisition, { nullable: true })
  @UseMiddleware(isAuth)
  async splitRequisition(
    @Arg('input') input: RequisitionSplitInput,
    @Ctx() { req }: Context
  ): Promise<Requisition | undefined> {
    try {
      const createdBy: string = req.session.username;
      const sql = `
    BEGIN
      GBR_SPT_API.SPLIT_REQUISITION(:reqNo, :requisitionDate, :rollQty, :meter, :weight, :volume, :reqNoSplit, :rollQtySplit, :meterSplit,
        :weightSplit, :volumeSplit, :createdBy,  :outRequisitionNo, :outRequisitionNoSplit);
    END;
  `;
      const result = await getConnection().query(sql, [
        input.reqNo,
        input.requisitionDate,
        input.rollQty,
        input.meter,
        input.weight,
        input.volume,
        input.reqNoSplit,
        input.rollQtySplit,
        input.meterSplit,
        input.weightSplit,
        input.volumeSplit,
        createdBy,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outReqNo = result[0];
      const data = Requisition.findOne({ reqNo: outReqNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Requisition)
  @UseMiddleware(isAuth)
  async deleteRequisition(@Arg('reqNo') reqNo: string): Promise<Requisition> {
    try {
      const requisition = await Requisition.findOne({
        reqNo
      });
      if (!requisition) throw new Error('No data found');
      const sql = `
    BEGIN
      GBR_SPT_API.DELETE_Requisition(:reqNo);
    END;
  `;
      await getConnection().query(sql, [reqNo]);
      return requisition;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
