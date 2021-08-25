import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { setErrors } from '@/utils/set-errors';
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
import { AssignDetailResponse } from './spt-assign-detail.dr';
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

  @Mutation(() => AssignDetailResponse)
  @UseMiddleware(isAuth)
  async createAssignDetail(
    @Arg('input') input: AssignDetailInput,
    @Ctx() { req }: Context
  ): Promise<AssignDetailResponse | undefined> {
    let result;
    //const createdBy: string = req.session.userId;
    const sql = `
      BEGIN
        GBR_SPT_API.Create_Assign_Detail(:assignId, :assignDate, :reqNo, :outAssignId, :outReqNo);
      END;
    `;
    try {
      result = await getConnection().query(sql, [
        input.assignId,
        input.assignDate,
        input.reqNo,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }
    const outAssignId = result[0] as string;
    const outReqNo = result[1] as number;
    const data = AssignDetail.findOne({
      assignId: outAssignId,
      reqNo: outReqNo
    });
    return { success: true, data };
  }

  @Mutation(() => AssignDetailResponse)
  @UseMiddleware(isAuth)
  async deleteAssignDetail(
    @Arg('assignId') assignId: string,
    @Arg('reqNo') reqNo: number
    //@Ctx() { req }: Context
  ): Promise<AssignDetailResponse> {
    //const createdBy: string = req.session.userId;
    const assignDetail = await AssignDetail.findOne({
      assignId: assignId,
      reqNo: reqNo
    });

    if (!assignDetail) return setErrors('No data found.');
    try {
      await AssignDetail.delete({ assignId: assignId, reqNo: reqNo });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
