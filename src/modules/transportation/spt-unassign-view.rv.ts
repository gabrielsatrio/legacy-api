import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
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
    try {
      return await UnassignView.find({ where: { contract: In(contract) } });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => UnassignView, { nullable: true })
  @UseMiddleware(isAuth)
  async getUnassignView(
    @Arg('reqNo') reqNo: number
  ): Promise<UnassignView | null> {
    try {
      return await UnassignView.findOneBy({ reqNo: reqNo.toString() });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
