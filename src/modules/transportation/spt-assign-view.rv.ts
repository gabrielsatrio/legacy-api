import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
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
    try {
      return await AssignView.find({ where: { contract: In(contract) } });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => AssignView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignView(
    @Arg('assignId') assignId: string
  ): Promise<AssignView | null> {
    try {
      return await AssignView.findOneBy({ assignId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
