import { isAuth } from '@/middlewares/is-auth';
import { customEmail } from '@/utils/custom-email';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like, Not } from 'typeorm';
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

  @Query(() => EmployeeView)
  @UseMiddleware(isAuth)
  async getEmployeeWithCustomEmail(
    @Arg('employeeId') employeeId: string
  ): Promise<EmployeeView | undefined> {
    const employee = await EmployeeView.findOne({ employeeId });
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

  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getMaintenancePerson(
    @Arg('workLocation') workLocation: string
  ): Promise<EmployeeView[]> {
    const employees = await EmployeeView.find({
      where: [
        {
          workLocation,
          jobId: Not(Like('HLD%')),
          organizationName: Like('%Maintenance%')
        },
        {
          workLocation,
          jobId: Not(Like('HLD%')),
          organizationName: Like('%Electrical%')
        }
      ],
      order: { name: 'ASC' }
    });
    employees.map((employee) => (employee.email = customEmail(employee.email)));
    return employees;
  }
}
