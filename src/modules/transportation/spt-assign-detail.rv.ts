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
import { AssignDetail } from './entities/spt-assign-detail';
import { AssignDetailInput } from './spt-assign-detail.in';

@Resolver(AssignDetail)
export class AssignDetailResolver {
  @Query(() => [AssignDetail])
  @UseMiddleware(isAuth)
  async getAllAssignDetail(): Promise<AssignDetail[] | undefined> {
    return AssignDetail.find();
  }

  @Query(() => AssignDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignDetail(
    @Arg('assignId') assignId: string,
    @Arg('reqNo') reqNo: number
  ): Promise<AssignDetail | undefined> {
    return await AssignDetail.findOne({
      assignId: assignId,
      reqNo: reqNo
    });
  }

  @Mutation(() => AssignDetail)
  @UseMiddleware(isAuth)
  async createAssignDetail(
    @Arg('input') input: AssignDetailInput,
    @Ctx() { req }: Context
  ): Promise<AssignDetail | undefined> {
    let result;
    //const createdBy: string = req.session.userId;
    const sql = `
      BEGIN
        GBR_SPT_API.Create_Assign_Detail(:assignId, :assignDate, :reqNo, :requisitionDate, :outAssignId, :outReqNo, :outAssignDate, :outRequisitionDate);
      END;
    `;
    try {
      result = await getConnection().query(sql, [
        input.assignId,
        input.assignDate,
        input.reqNo,
        input.requisitionDate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outAssignId = result[0] as string;
    const outReqNo = result[1] as number;
    const outAssignDate = result[2] as Date;
    const outRequisitionDate = result[3] as Date;
    const data = AssignDetail.findOne({
      assignId: outAssignId,
      reqNo: outReqNo,
      assignDate: outAssignDate,
      requisitionDate: outRequisitionDate
    });
    return data;
  }

  @Mutation(() => AssignDetail)
  @UseMiddleware(isAuth)
  async deleteAssignDetail(
    @Arg('assignId') assignId: string,
    @Arg('assignDate') assignDate: Date,
    @Arg('reqNo') reqNo: number,
    @Arg('requisitionDate') requisitionDate: Date
    //@Ctx() { req }: Context
  ): Promise<AssignDetail> {
    //const createdBy: string = req.session.userId;
    const assignDetail = await AssignDetail.findOne({
      assignId: assignId,
      assignDate: assignDate,
      reqNo: reqNo,
      requisitionDate: requisitionDate
    });

    if (!assignDetail) throw new Error('No data found.');
    try {
      await AssignDetail.delete({
        assignId: assignId,
        assignDate: assignDate,
        reqNo: reqNo,
        requisitionDate: requisitionDate
      });
      return assignDetail;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  // @Mutation(() => AssignDetail)
  // @UseMiddleware(isAuth)
  // async deleteAssignDetail(
  //   @Arg('input') input: AssignDetailInput,
  //   @Ctx() { req }: Context
  // ): Promise<AssignDetail | undefined> {
  //   let result;
  //   //const createdBy: string = req.session.userId;
  //   const sql = `
  //     BEGIN
  //       GBR_SPT_API.Delete_Assign_Detail(:assignId, :assignDate, :reqNo, :requisitionDate, :outAssignId, :outReqNo, :outAssignDate, :outRequisitionDate);
  //     END;
  //   `;
  //   console.log('delete input', input);
  //   try {
  //     result = await getConnection().query(sql, [
  //       input.assignId,
  //       input.assignDate,
  //       input.reqNo,
  //       input.requisitionDate,
  //       { dir: oracledb.BIND_OUT, type: oracledb.STRING },
  //       { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  //       { dir: oracledb.BIND_OUT, type: oracledb.DATE },
  //       { dir: oracledb.BIND_OUT, type: oracledb.DATE }
  //     ]);
  //   } catch (err) {
  //     throw new Error(mapError(err));
  //   }
  //   const outAssignId = result[0] as string;
  //   const outReqNo = result[1] as number;
  //   const outAssignDate = result[2] as Date;
  //   const outRequisitionDate = result[3] as Date;

  //   const data = AssignDetail.findOne({
  //     assignId: outAssignId,
  //     reqNo: outReqNo,
  //     assignDate: outAssignDate,
  //     requisitionDate: outRequisitionDate
  //   });
  //   return data;
  // }
}
