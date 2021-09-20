import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { DepartmentView } from './entities/department.vw';

@Resolver(DepartmentView)
export class DepartmentResolver {
  @Query(() => [DepartmentView])
  @UseMiddleware(isAuth)
  async getAllDepartments(): Promise<DepartmentView[] | undefined> {
    return await DepartmentView.find({ order: { departmentId: 'ASC' } });
  }
}
