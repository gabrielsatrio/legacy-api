import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like } from 'typeorm';
import { IfsWorkCenterView } from './entities/ifs-work-center.vw';

@Resolver(IfsWorkCenterView)
export class IfsShopOrderResolver {
  @Query(() => [IfsWorkCenterView], { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignedMachWcByContractDeptNo(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('departmentNo', { defaultValue: '%', nullable: true })
    departmentNo: string
  ): Promise<IfsWorkCenterView[] | undefined> {
    const results = await IfsWorkCenterView.find({
      relations: ['machines'],
      where: { contract: In(contract), departmentNo: Like(departmentNo) },
      order: { workCenterNo: 'ASC' }
    });

    const filteredResults = results.filter((data) => data?.machines !== null);
    return filteredResults;
  }
}
