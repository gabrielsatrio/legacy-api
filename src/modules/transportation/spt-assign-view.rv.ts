import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AssignView } from './entities/spt-assign-view';

@Resolver(AssignView)
export class AssignResolver {
  @Query(() => [AssignView])
  @UseMiddleware(isAuth)
  async getAllAssignViews(): Promise<AssignView[] | undefined> {
    return AssignView.find();
  }

  @Query(() => AssignView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignView(
    @Arg('assignId') assignId: string
  ): Promise<AssignView | undefined> {
    return await AssignView.findOne(assignId);
  }
}
