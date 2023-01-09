import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { DisabledEmployeesInput } from './disabled-employee.in';
import { DisabledEmployees } from './entities/disabled-employee';
import { DisabledEmployeesView } from './entities/disabled-employee.vw';

@Resolver(DisabledEmployees)
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createDisabledEmployeesPostgre(
    @Arg('input') input: DisabledEmployeesInput
  ): Promise<boolean | null> {
    try {
      const sql = `begin ang_disabled_employees_api.create__(:employeeId); end;`;
      await ifs.query(sql, [input.employeeId]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DisabledEmployees)
  @UseMiddleware(isAuth)
  async deleteDisabledEmployeesPostgre(
    @Arg('employeeId') employeeId: string
  ): Promise<DisabledEmployees | null> {
    try {
      const sql = `begin ang_disabled_employees_api.delete__(:employeeId); end;`;
      const data = await DisabledEmployees.findOneBy({ employeeId });
      if (!data) throw new Error('No data found.');
      await ifs.query(sql, [employeeId]);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
