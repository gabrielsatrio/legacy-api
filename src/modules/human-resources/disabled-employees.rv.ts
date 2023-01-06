import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Int, Query, Resolver, UseMiddleware } from 'type-graphql';
import { DisabledEmployeesView } from './entities/disabled-employees.vw';

@Resolver(DisabledEmployeesView)
export class DisabledEmployeesResolver {
  @Query(() => [DisabledEmployeesView])
  @UseMiddleware(isAuth)
  async getAllDisabledEmployees(): Promise<
    DisabledEmployeesView[] | undefined
  > {
    try {
      return await DisabledEmployeesView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => DisabledEmployeesView, { nullable: true })
  @UseMiddleware(isAuth)
  async getDisabledEmployee(
    @Arg('employeeId', () => Int) employeeId: string
  ): Promise<DisabledEmployeesView | null> {
    try {
      return await DisabledEmployeesView.findOneBy({ employeeId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
