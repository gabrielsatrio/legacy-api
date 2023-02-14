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
import { DepartmentAltInput } from './department-alt.in';
import { DepartmentAlt } from './entities/deparment-alt';

@Resolver(DepartmentAlt)
export class DeoartmentAltResolver {
  @Query(() => [DepartmentAlt])
  @UseMiddleware(isAuth)
  async getAllDepartmentAlts(): Promise<DepartmentAlt[] | undefined> {
    try {
      return await DepartmentAlt.find({ order: { departmentId: 'ASC' } });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => DepartmentAlt, { nullable: true })
  @UseMiddleware(isAuth)
  async getDepartmentAlt(
    @Arg('departmentId') departmentId: string
  ): Promise<DepartmentAlt | null> {
    try {
      return await DepartmentAlt.findOneBy({ departmentId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DepartmentAlt)
  @UseMiddleware(isAuth)
  async createDepartmentAlt(
    @Arg('input') input: DepartmentAltInput,
    @Ctx() { req }: Context
  ): Promise<DepartmentAlt> {
    try {
      const existingData = await DepartmentAlt.findOneBy({
        departmentId: input.departmentId
      });
      if (existingData) throw new Error('Data already exists.');
      const data = DepartmentAlt.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await DepartmentAlt.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DepartmentAlt, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDepartmentAlt(
    @Arg('input') input: DepartmentAltInput
  ): Promise<DepartmentAlt> {
    try {
      const data = await DepartmentAlt.findOneBy({
        departmentId: input.departmentId
      });
      if (!data) throw new Error('No data found.');
      DepartmentAlt.merge(data, {
        ...input
      });
      const result = await DepartmentAlt.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DepartmentAlt)
  @UseMiddleware(isAuth)
  async deleteDepartmentAlt(
    @Arg('departmentId') departmentId: string
  ): Promise<DepartmentAlt> {
    try {
      const data = await DepartmentAlt.findOneBy({ departmentId });
      if (!data) throw new Error('No data found.');
      await DepartmentAlt.delete({ departmentId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
