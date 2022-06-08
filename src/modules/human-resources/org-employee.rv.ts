import { isAuth } from '@/middlewares/is-auth';
import { customEmail } from '@/utils/custom-email';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like } from 'typeorm';
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
  ): Promise<EmployeeView | null> {
    return await EmployeeView.findOneBy({ employeeId });
  }

  @Query(() => EmployeeView)
  @UseMiddleware(isAuth)
  async getEmployeeWithCustomEmail(
    @Arg('employeeId') employeeId: string
  ): Promise<EmployeeView | null> {
    const employee = await EmployeeView.findOneBy({ employeeId });
    if (employee) employee.email = customEmail(employee.email);
    return employee;
  }

  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getEmployeesByGrade(
    @Arg('grade', () => [String]) grade: string[]
  ): Promise<EmployeeView[]> {
    return await EmployeeView.find({
      where: { grade: In(grade) },
      order: { name: 'ASC' }
    });
  }

  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getEmployeesByOrg(
    @Arg('workLocation') workLocation: string,
    @Arg('organizationName') organizationName: string
  ): Promise<EmployeeView[]> {
    const employees = await EmployeeView.find({
      where: { workLocation, organizationName: Like(organizationName) },
      order: { name: 'ASC' }
    });
    employees.map((employee) => (employee.email = customEmail(employee.email)));
    return employees;
  }
}
