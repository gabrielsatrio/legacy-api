import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Like } from 'typeorm';
import { WorkCenterView } from './entities/work-center.vw';

@Resolver(WorkCenterView)
export class WorkCenterResolver {
  @Query(() => [WorkCenterView])
  @UseMiddleware(isAuth)
  async getWorkCentersByContractDept(
    @Arg('contract') contract: string,
    @Arg('departmentNo') departmentNo: string
  ): Promise<WorkCenterView[] | undefined> {
    return await WorkCenterView.find({
      where: {
        contract,
        departmentNo: Like(departmentNo)
      },
      order: { workCenterNo: 'ASC' }
    });
  }
}
