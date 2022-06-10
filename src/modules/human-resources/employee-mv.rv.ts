import { isAuth } from '@/middlewares/is-auth';
import { getEmail } from '@/utils/get-email';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { User } from '../core/entities/user';
import { EmployeeMaterializedView } from './entities/employee.mv';

@Resolver(EmployeeMaterializedView)
export class EmployeeMaterializedViewResolver {
  @Query(() => EmployeeMaterializedView)
  @UseMiddleware(isAuth)
  async getEmployeeMv(
    @Arg('employeeId') employeeId: string,
    @Arg('defaultEmail', { defaultValue: false, nullable: true })
    defaultEmail?: boolean
  ): Promise<EmployeeMaterializedView | null> {
    try {
      const employee = await EmployeeMaterializedView.findOneBy({ employeeId });
      if (employee && !defaultEmail) {
        employee.email = await getEmail(employee.email, employee.employeeId);
      }
      return employee;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [EmployeeMaterializedView])
  @UseMiddleware(isAuth)
  async getUnregisteredUsers(): Promise<EmployeeMaterializedView[]> {
    try {
      const employees = await EmployeeMaterializedView.find({
        order: { name: 'ASC' }
      });
      const users = await User.find();
      const registeredUsers = users.map((user) => user.username);
      const unregisteredUsers = employees.filter(
        (employee) => !registeredUsers.includes(employee.employeeId)
      );
      await Promise.all(
        unregisteredUsers.map(
          async (employee) => (employee.email = await getEmail(employee.email))
        )
      );
      return unregisteredUsers;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [EmployeeMaterializedView])
  @UseMiddleware(isAuth)
  async getEmployeesByGradeWorkLocation(
    @Arg('grade', () => [String]) grade: string[],
    @Arg('workLocation', () => [String]) workLocation: string[]
  ): Promise<EmployeeMaterializedView[]> {
    try {
      const employees = await EmployeeMaterializedView.find({
        where: { grade: In(grade), workLocation: In(workLocation) },
        order: { name: 'ASC' }
      });
      await Promise.all(
        employees.map(
          async (employee) =>
            (employee.email = await getEmail(
              employee.email,
              employee.employeeId
            ))
        )
      );
      return employees;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
