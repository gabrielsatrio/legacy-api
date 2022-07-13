import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsDopHeadView } from './entities/ifs-dop-head.vw';

@Resolver(IfsDopHeadView)
export class IfsDopHeadResolver {
  @Query(() => [IfsDopHeadView], { nullable: true })
  @UseMiddleware(isAuth)
  async getDopHeadByDopId(
    @Arg('dopId') dopId: string
  ): Promise<IfsDopHeadView[] | undefined> {
    try {
      return await IfsDopHeadView.findBy({ dopId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
