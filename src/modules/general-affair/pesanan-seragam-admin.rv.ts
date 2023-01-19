import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { PesananSeragamAdmin } from './entities/pesanan-seragam-admin';
import { PesananSeragamAdminView } from './entities/pesanan-seragam-admin.vw';

@Resolver(PesananSeragamAdmin)
export class PesananSeragamAdminResolver {
  @Query(() => [PesananSeragamAdminView])
  @UseMiddleware(isAuth)
  async getAllPesananSeragamAdmin(): Promise<
    PesananSeragamAdminView[] | undefined
  > {
    try {
      return await PesananSeragamAdminView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [String])
  @UseMiddleware(isAuth)
  async getPesananSeragamAdminSite(
    @Arg('employeeId', () => String) employeeId: string
  ): Promise<string[] | undefined> {
    try {
      const admin = await PesananSeragamAdmin.findOneBy({ employeeId });
      const sites = admin?.allowedSite;
      const allwoedSites = sites?.split(',');
      return allwoedSites || ['null'];
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [String])
  @UseMiddleware(isAuth)
  async getPesananSeragamAdminDepartment(
    @Arg('employeeId', () => String) employeeId: string
  ): Promise<string[] | undefined> {
    try {
      const admin = await PesananSeragamAdmin.findOneBy({ employeeId });
      const departments = admin?.allowedDepartment;
      const allowedDepartments = departments?.split(',');
      return allowedDepartments || ['null'];
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [String])
  @UseMiddleware(isAuth)
  async getPesananSeragamAdminAllowedId(
    @Arg('employeeId', () => String) employeeId: string
  ): Promise<string[] | undefined> {
    try {
      const admin = await PesananSeragamAdmin.findOneBy({ employeeId });
      const employees = admin?.allowedEmployeeId;
      const allowedEmployeeId = employees?.split(',');
      return allowedEmployeeId || ['null'];
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
