import { isAuth } from '@/middlewares/is-auth';
import { customEmail } from '@/utils/custom-email';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
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
}
