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
    @Arg('assignId') assignId: string
  ): Promise<Assign | undefined> {
    return await Assign.findOne(assignId);
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
        GBR_SPT_API.Create_Assign(:assignId, :assignDate, :type, :createdBy, :outAssignId)
      END;
    `;
    try {
      result = await getConnection().query(sql, [
        input.assignId,
        input.assignDate,
        input.type,
        createdBy,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }
    const outAssignId = result[0] as string;
    const data = Assign.findOne({
      assignId: outAssignId
    });
    return { success: true, data };
  }

  @Mutation(() => AssignResponse)
  @UseMiddleware(isAuth)
  async deleteAssign(
    @Arg('assignId') assignId: string
    //@Ctx() { req }: Context
  ): Promise<AssignResponse> {
    //const createdBy: string = req.session.userId;
    const assign = await Assign.findOne({
      assignId
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
