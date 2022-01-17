import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MoreThanOrEqual } from 'typeorm';
import { EmployeeView } from './entities/org-employee.vw';

@Resolver(EmployeeView)
export class EmployeeResolver {
  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getAllEmployees(): Promise<EmployeeView[]> {
    return await EmployeeView.find({ order: { employeeId: 'ASC' } });
  }

  @Query(() => EmployeeView)
  @UseMiddleware(isAuth)
  async getEmployee(
    @Arg('employeeId') employeeId: string
  ): Promise<EmployeeView | undefined> {
    return await EmployeeView.findOne({ employeeId });
  }

  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getManagers(): Promise<EmployeeView[]> {
    return await EmployeeView.find({
      where: { grade: MoreThanOrEqual(7) }, // TODO: revert to grade 9 or more!!
      order: { name: 'ASC' }
    });
  }

  @Query(() => EmployeeView)
  @UseMiddleware(isAuth)
  async getEmployeeWithCustomEmail(
    @Arg('employeeId') employeeId: string
  ): Promise<EmployeeView | undefined> {
    const employee = await EmployeeView.findOne({ employeeId });
    const allowedDomains = ['ateja.co.id', 'agtex.co.id'];
    if (employee?.email) {
      employee.email = allowedDomains.includes(
        employee?.email.slice(employee.email.indexOf('@') + 1) || ''
      )
        ? employee?.email.toLowerCase()
        : 'oracle@ateja.co.id';
    }
    return employee;
  }
}
