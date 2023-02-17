import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { DeptKasbon } from './entities/kasbon-dept';
import { DeptKasbonView } from './entities/kasbon-dept.vw';
import { DeptKasbonInput } from './kasbon-dept.in';

@Resolver(DeptKasbon)
export class DeptKasbonResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkDeptKasbonExist(
    @Arg('department') department: string
  ): Promise<boolean> {
    try {
      return (await this.getDeptKasbon(department)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [DeptKasbonView])
  @UseMiddleware(isAuth)
  async getAllDeptKasbon(): Promise<DeptKasbonView[] | undefined> {
    try {
      return await DeptKasbonView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => DeptKasbonView, { nullable: true })
  @UseMiddleware(isAuth)
  async getDeptKasbon(
    @Arg('department') department: string
  ): Promise<DeptKasbonView | null> {
    try {
      return await DeptKasbonView.findOneBy({ department });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DeptKasbon)
  @UseMiddleware(isAuth)
  async createDeptKasbon(
    @Arg('input') input: DeptKasbonInput
  ): Promise<DeptKasbon | undefined> {
    try {
      const existingData = await DeptKasbon.findOneBy({
        department: input.department
      });
      if (existingData) throw new Error('Data already exists.');
      const data = DeptKasbon.create({
        ...input
      });
      const result = await DeptKasbon.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DeptKasbon, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDeptKasbon(
    @Arg('input') input: DeptKasbonInput
  ): Promise<DeptKasbon | undefined> {
    try {
      const data = await DeptKasbon.findOneBy({
        department: input.department
      });
      if (!data) throw new Error('No data found.');
      DeptKasbon.merge(data, { ...input });
      const result = await DeptKasbon.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DeptKasbon)
  @UseMiddleware(isAuth)
  async deleteDeptKasbon(
    @Arg('department') department: string
  ): Promise<DeptKasbon> {
    try {
      const data = await DeptKasbon.findOneBy({ department });
      if (!data) throw new Error('No data found.');
      await DeptKasbon.delete({ department });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
