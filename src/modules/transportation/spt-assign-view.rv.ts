import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { AssignView } from './entities/spt-assign-view';

@Resolver(AssignView)
export class AssignResolver {
  @Query(() => [AssignView])
  @UseMiddleware(isAuth)
  async getAllAssignViews(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<AssignView[] | undefined> {
    return await AssignView.find({ where: { contract: In(contract) } });
  }

  @Query(() => AssignView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignView(
    @Arg('assignId') assignId: string
  ): Promise<AssignView | undefined> {
    return await AssignView.findOne(assignId);
  }
}
