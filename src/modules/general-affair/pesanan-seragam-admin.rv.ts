import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AdminPesananSeragam } from './entities/pesanan-seragam-admin';
import { AdminPesananSeragamView } from './entities/pesanan-seragam-admin.vw';

@Resolver(AdminPesananSeragam)
export class AdminPesananSeragamResolver {
  @Query(() => [AdminPesananSeragamView])
  @UseMiddleware(isAuth)
  async getAllAdminPesananSeragam(): Promise<
    AdminPesananSeragamView[] | undefined
  > {
    try {
      return await AdminPesananSeragamView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AdminPesananSeragam)
  @UseMiddleware(isAuth)
  async createAdminPesananSeragam(
    @Arg('employeeId', () => String) employeeId: string
  ): Promise<AdminPesananSeragam | undefined> {
    try {
      const exist = await AdminPesananSeragam.findOneBy({ employeeId });
      if (exist) throw new Error('Data already exist');
      const result = AdminPesananSeragam.create({ employeeId });
      await AdminPesananSeragam.save(result);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteAdminPesananSeragam(
    @Arg('employeeId', () => String) employeeId: string
  ): Promise<boolean | undefined> {
    try {
      const exist = await AdminPesananSeragam.findOneBy({ employeeId });
      if (!exist) throw new Error('Data not exist');
      await AdminPesananSeragam.delete({ employeeId });
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
