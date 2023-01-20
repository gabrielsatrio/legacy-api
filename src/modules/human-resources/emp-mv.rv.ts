import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { EmpMaterializedView } from './entities/emp.mv';

@Resolver(EmpMaterializedView)
export class EmpMaterializedViewResolver {
  @Query(() => EmpMaterializedView)
  @UseMiddleware(isAuth)
  async getEmpMv(
    @Arg('employeeId', () => String) employeeId: string
  ): Promise<EmpMaterializedView | null> {
    try {
      return await EmpMaterializedView.findOneBy({ employeeId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
