import { ifs } from '@/database/data-sources';
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
import { In } from 'typeorm';
import { Requisition } from './entities/spt-requisition';
import { RequisitionView } from './entities/spt-requisition.vw';
import { RequisitionSplitInput } from './spt-requisition-split.in';
import { RequisitionInput } from './spt-requisition.in';

@Resolver(Requisition)
export class RequisitionResolver {
  @Query(() => [Requisition])
  @UseMiddleware(isAuth)
  async getAllRequisitions(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<Requisition[] | undefined> {
    return await Requisition.find({ where: { contract: In(contract) } });
  }

  @Query(() => [RequisitionView])
  @UseMiddleware(isAuth)
  async getAllRequisitionViews(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<RequisitionView[] | undefined> {
    return await RequisitionView.find({ where: { contract: In(contract) } });
  }

  @Query(() => Requisition, { nullable: true })
  @UseMiddleware(isAuth)
  async getRequisition(
    @Arg('requisitionId') requisitionId: string
  ): Promise<Requisition | null> {
    return await Requisition.findOneBy({ reqNo: requisitionId });
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignStatus(@Arg('reqNo') reqNo: string): Promise<string> {
    try {
      const sql = `SELECT GBR_SPT_API.IS_ASSIGNED(:reqNo) AS "status" FROM DUAL`;
      const result = await ifs.query(sql, [reqNo]);
      return result[0].status;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Requisition)
  @UseMiddleware(isAuth)
  async createRequisition(
    @Arg('input') input: RequisitionInput,
    @Ctx() { req }: Context
  ): Promise<Requisition | null> {
    try {
      const createdBy: string = req.session.username;
      const sql = `
        BEGIN
          GBR_SPT_API.Create_Requisition(:reqNo, :destinationId, :ds, :divisi, :customerId, :via, :requisitionDate, :rollQty, :space, :meter, :weight, :volume, :contract, :notes, :createdBy, :outRequisitionNo);
        END;
      `;

      const result = await ifs.query(sql, [
        input.reqNo,
        input.destinationId,
        '',
        input.divisi,
        input.customerId,
        input.via,
        input.requisitionDate,
        input.rollQty,
        input.space,
        input.meter,
        input.weight,
        input.volume,
        input.contract,
        input.notes,
        createdBy,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outReqNo = result[0] as number;
      const data = Requisition.findOneBy({ reqNo: outReqNo.toString() });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Requisition, { nullable: true })
  @UseMiddleware(isAuth)
  async updateRequisition(
    @Arg('input') input: RequisitionInput
  ): Promise<Requisition | null> {
    try {
      const requisition = await Requisition.findOneBy({ reqNo: input.reqNo });
      if (!requisition) throw new Error('No data found');
      const sql = `
        BEGIN
          GBR_SPT_API.Update_Requisition(:reqNo, :destinationId, :ds, :divisi, :customerId, :via, :requisitionDate, :rollQty, :space, :meter, :weight, :volume, :contract, :notes,  :outRequisitionNo);
        END;
      `;

      const result = await ifs.query(sql, [
        input.reqNo,
        input.destinationId,
        input.ds,
        input.divisi,
        input.customerId,
        input.via,
        input.requisitionDate,
        input.rollQty,
        input.space,
        input.meter,
        input.weight,
        input.volume,
        input.contract,
        input.notes,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outReqNo = result[0];
      const data = Requisition.findOneBy({ reqNo: outReqNo });
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
  ): Promise<Requisition | null> {
    try {
      const createdBy: string = req.session.username;
      const sql = `
    BEGIN
      GBR_SPT_API.SPLIT_REQUISITION(:reqNo, :requisitionDate, :rollQty, :meter, :weight, :volume, :reqNoSplit, :rollQtySplit, :meterSplit,
        :weightSplit, :volumeSplit, :createdBy,  :outRequisitionNo, :outRequisitionNoSplit);
    END;
  `;
      const result = await ifs.query(sql, [
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
      const data = Requisition.findOneBy({ reqNo: outReqNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Requisition)
  @UseMiddleware(isAuth)
  async deleteRequisition(@Arg('reqNo') reqNo: string): Promise<Requisition> {
    try {
      const requisition = await Requisition.findOneBy({
        reqNo
      });
      if (!requisition) throw new Error('No data found');
      const sql = `
    BEGIN
      GBR_SPT_API.DELETE_Requisition(:reqNo);
    END;
  `;
      await ifs.query(sql, [reqNo]);
      return requisition;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
