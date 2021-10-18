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
    return await EmployeeView.find({ grade: MoreThanOrEqual(9) });
  }
}
