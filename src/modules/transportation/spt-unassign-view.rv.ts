import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { UnassignView } from './entities/spt-unassign-view';

@Resolver(UnassignView)
export class UnassignViewResolver {
  @Query(() => [UnassignView])
  @UseMiddleware(isAuth)
  async getAllUnassignViews(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<UnassignView[] | undefined> {
    return await UnassignView.find({ where: { contract: In(contract) } });
  }

  @Query(() => UnassignView, { nullable: true })
  @UseMiddleware(isAuth)
  async getUnassignView(
    @Arg('reqNo') reqNo: number
  ): Promise<UnassignView | undefined> {
    return await UnassignView.findOne(reqNo);
  }
}
