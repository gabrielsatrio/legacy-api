import { isAuth } from '@/middlewares/is-auth';
import { customEmail } from '@/utils/custom-email';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { User } from '../core/entities/user';
import { EmployeeMaterializedView } from './entities/employee.mv';

@Resolver(EmployeeMaterializedView)
export class EmployeeMaterializedViewResolver {
  @Query(() => EmployeeMaterializedView)
  @UseMiddleware(isAuth)
  async getEmployeeMvWithCustomEmail(
    @Arg('employeeId') employeeId: string
  ): Promise<EmployeeMaterializedView | null> {
    const employee = await EmployeeMaterializedView.findOneBy({ employeeId });
    if (employee) employee.email = customEmail(employee.email);
    return employee;
  }

  @Query(() => [EmployeeMaterializedView])
  @UseMiddleware(isAuth)
  async getUnregisteredUsers(): Promise<EmployeeMaterializedView[]> {
    const employees = await EmployeeMaterializedView.find({
      order: { name: 'ASC' }
    });
    const users = await User.find();
    const registeredUsers = users.map((user) => user.username);
    const unregisteredUsers = employees.filter(
      (employee) => !registeredUsers.includes(employee.employeeId)
    );
    unregisteredUsers.map(
      (employee) => (employee.email = customEmail(employee.email))
    );
    return unregisteredUsers;
  }

  @Query(() => [EmployeeMaterializedView])
  @UseMiddleware(isAuth)
  async getEmployeesByGradeWorkLocation(
    @Arg('grade', () => [String]) grade: string[],
    @Arg('workLocation', () => [String]) workLocation: string[]
  ): Promise<EmployeeMaterializedView[]> {
    return await EmployeeMaterializedView.find({
      where: { grade: In(grade), workLocation: In(workLocation) },
      order: { name: 'ASC' }
    });
  }
}
