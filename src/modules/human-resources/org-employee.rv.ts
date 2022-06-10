import { isAuth } from '@/middlewares/is-auth';
import { getEmail } from '@/utils/get-email';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like } from 'typeorm';
import { EmployeeView } from './entities/org-employee.vw';

@Resolver(EmployeeView)
export class EmployeeResolver {
  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getAllEmployees(): Promise<EmployeeView[]> {
    try {
      return await EmployeeView.find({ order: { employeeId: 'ASC' } });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => EmployeeView)
  @UseMiddleware(isAuth)
  async getEmployee(
    @Arg('employeeId') employeeId: string,
    @Arg('defaultEmail', { defaultValue: false, nullable: true })
    defaultEmail?: boolean
  ): Promise<EmployeeView | null> {
    try {
      const employee = await EmployeeView.findOneBy({ employeeId });
      if (employee && !defaultEmail) {
        employee.email = await getEmail(employee.email, employee.employeeId);
      }
      return employee;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getEmployeesByGrade(
    @Arg('grade', () => [String]) grade: string[]
  ): Promise<EmployeeView[]> {
    try {
      return await EmployeeView.find({
        where: { grade: In(grade) },
        order: { name: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getEmployeesByOrg(
    @Arg('workLocation') workLocation: string,
    @Arg('organizationName') organizationName: string
  ): Promise<EmployeeView[]> {
    try {
      return await EmployeeView.find({
        where: { workLocation, organizationName: Like(organizationName) },
        order: { name: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
