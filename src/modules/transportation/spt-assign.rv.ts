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
import { Assign } from './entities/spt-assign';
import { AssignInput } from './spt-assign.in';

@Resolver(Assign)
export class AssignResolver {
  @Query(() => [Assign])
  @UseMiddleware(isAuth)
  async getAllAssigns(): Promise<Assign[] | undefined> {
    try {
      return await Assign.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Assign, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssign(
    @Arg('assignId') assignId: string,
    @Arg('assignDate') assignDate: Date
  ): Promise<Assign | null> {
    try {
      return await Assign.findOneBy({ assignId, assignDate });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Assign, { nullable: true })
  @UseMiddleware(isAuth)
  async getMaxAssignId(
    @Arg('tipe') tipe: string,
    @Arg('assignDate') assignDate: Date
  ): Promise<any | undefined> {
    try {
      const sql = `SELECT GBR_SPT_API.GET_NEXT_ASSIGN_ID(:tipe, :assignDate) AS "assignId" FROM DUAL`;
      const result = await ifs.query(sql, [tipe, assignDate]);
      const assignId = result[0].assignId;
      return { assignId };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [Assign])
  @UseMiddleware(isAuth)
  async getAssignIdByDate(
    @Arg('assignDate') assignDate: Date
  ): Promise<Assign[] | undefined> {
    try {
      return await Assign.findBy({ assignDate: assignDate });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Assign)
  @UseMiddleware(isAuth)
  async createAssign(
    @Arg('input') input: AssignInput,
    @Ctx() { req }: Context
  ): Promise<Assign | null> {
    try {
      const createdBy: string = req.session.username;
      const sql = `
      BEGIN
        GBR_SPT_API.Create_Assign(:assignId, :assignDate, :tipe, :createdBy, :outAssignId);
      END;
    `;
      const result = await ifs.query(sql, [
        input.assignId,
        input.assignDate,
        input.tipe,
        createdBy,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outAssignId = result[0] as string;
      const data = Assign.findOneBy({
        assignId: outAssignId,
        assignDate: input.assignDate
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Assign, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAssign(@Arg('input') input: AssignInput): Promise<Assign | null> {
    try {
      const assign = await Assign.findOneBy({
        assignId: input.assignId
      });
      if (!assign) throw new Error('No data found');
      const sql = `
    BEGIN
      GBR_SPT_API.Update_Assign(:assignId, :assignDate,  :tipe, :outAssignId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.assignId,
        input.assignDate,
        input.tipe,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outAssignId = result[0];
      const data = Assign.findOneBy({
        assignId: outAssignId,
        assignDate: input.assignDate
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Assign)
  @UseMiddleware(isAuth)
  async deleteAssign(
    @Arg('assignId') assignId: string,
    @Arg('assignDate') assignDate: Date
  ): Promise<Assign> {
    try {
      const assign = await Assign.findOneBy({
        assignId,
        assignDate
      });
      if (!assign) throw new Error('No data found.');
      const sql = `BEGIN GBR_SPT_API.DELETE_ASSIGN(:assignId, :assignDate); END;`;
      await ifs.query(sql, [assignId, assignDate]);
      return assign;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
