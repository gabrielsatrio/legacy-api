import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { DisabledEmployeesView } from './entities/disabled-employees.vw';

@Resolver(DisabledEmployeesView)
export class DisabledEmployeesResolver {
  @Query(() => [DisabledEmployeesView])
  @UseMiddleware(isAuth)
  async getAllDisabledEmployees(): Promise<
    DisabledEmployeesView[] | undefined
  > {
    try {
      return await DisabledEmployeesView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => DisabledEmployeesView, { nullable: true })
  @UseMiddleware(isAuth)
  async getDisabledEmployee(
    @Arg('employeeId') employeeId: string
  ): Promise<DisabledEmployeesView | null> {
    try {
      return await DisabledEmployeesView.findOneBy({ employeeId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DisabledEmployeesView)
  @UseMiddleware(isAuth)
  async createDisabledEmployee(
    @Arg('employeeId') employeeId: string
  ): Promise<DisabledEmployeesView | null> {
    try {
      const sql = `begin ang_disabled_employees_api.create__(:employeeId); end;`;

      await ifs.query(sql, [employeeId]);

      const data = DisabledEmployeesView.findOneBy({ employeeId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
