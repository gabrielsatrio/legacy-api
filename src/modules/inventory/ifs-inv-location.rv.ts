import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like } from 'typeorm';
import { IfsInvLocationView } from './entities/ifs-inv-location.vw';

@Resolver(IfsInvLocationView)
export class IfsInventoryPartResolver {
  @Query(() => [IfsInvLocationView], { nullable: true })
  @UseMiddleware(isAuth)
  async getInventoryLocationByDept(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('warehouseId') warehouseId: string
  ): Promise<IfsInvLocationView[] | undefined> {
    return await IfsInvLocationView.find({
      where: { contract: In(contract), warehouseId: Like(`${warehouseId}%`) }
    });
  }
}
