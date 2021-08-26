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
import { Assign } from './entities/spt-assign';
import { AssignResponse } from './spt-assign.dr';
import { AssignInput } from './spt-assign.in';

@Resolver(Assign)
export class AssignResolver {
  @Query(() => [Assign])
  @UseMiddleware(isAuth)
  async getAllAssigns(): Promise<Assign[] | undefined> {
    return Assign.find();
  }

  @Query(() => Assign, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssign(
    @Arg('assignId') assignId: string,
    @Arg('assignDate') assignDate: Date
  ): Promise<Assign | undefined> {
    return await Assign.findOne({ assignId, assignDate });
  }

  @Query(() => Assign, { nullable: true })
  @UseMiddleware(isAuth)
  async getMaxAssignId(
    @Arg('tipe') tipe: string
    //@Arg('assignDate') assignDate: Date
  ): Promise<any | undefined> {
    let assignId;
    //const sql = `SELECT MAX(assign_id) as assign_id FROM GBR_SPT_ASSIGN_TAB where tipe = :tipe and assign_date = :assignDate`;
    const sql = `SELECT GBR_SPT_API.GET_NEXT_ASSIGN_ID(:tipe) AS ASSIGN_ID FROM DUAL`;
    try {
      assignId = await getConnection().query(sql, [tipe]);
      assignId = assignId[0].ASSIGN_ID;
      console.log('assignId', assignId);
    } catch (err) {
      return setErrors(err.message);
    }
    //return assignId;
    return await Assign.create({ assignId });
  }

  @Mutation(() => AssignResponse)
  @UseMiddleware(isAuth)
  async createAssign(
    @Arg('input') input: AssignInput,
    @Ctx() { req }: Context
  ): Promise<AssignResponse | undefined> {
    let result;
    const createdBy: string = req.session.userId;
    const sql = `
      BEGIN
        GBR_SPT_API.Create_Assign(:assignId, :assignDate, :tipe, :createdBy, :outAssignId);
      END;
    `;
    try {
      result = await getConnection().query(sql, [
        input.assignId,
        input.assignDate,
        input.tipe,
        createdBy,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }
    const outAssignId = result[0] as string;
    const data = Assign.findOne({
      assignId: outAssignId,
      assignDate: input.assignDate
    });
    return { success: true, data };
  }

  @Mutation(() => AssignResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAssign(
    @Arg('input') input: AssignInput
  ): Promise<AssignResponse | undefined> {
    let result;
    const assign = await Assign.findOne({
      assignId: input.assignId
    });
    if (!assign) {
      return undefined;
    }
    const sql = `
    BEGIN
      GBR_SPT_API.Update_Assign(:assignId, :assignDate,  :tipe, :outAssignId);
    END;
  `;
    try {
      result = await getConnection().query(sql, [
        input.assignId,
        input.assignDate,
        input.tipe,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }
    const outAssignId = result[0];
    const data = Assign.findOne({
      assignId: outAssignId,
      assignDate: input.assignDate
    });
    return { success: true, data };
  }

  @Mutation(() => AssignResponse)
  @UseMiddleware(isAuth)
  async deleteAssign(
    @Arg('assignId') assignId: string,
    @Arg('assignDate') assignDate: Date
    //@Ctx() { req }: Context
  ): Promise<AssignResponse> {
    //const createdBy: string = req.session.userId;
    const assign = await Assign.findOne({
      assignId,
      assignDate
    });
    if (!assign) return setErrors('No data found.');
    try {
      await Assign.delete({ assignId });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
