import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsDopHeadView } from './entities/ifs-dop-head.vw';

@Resolver(IfsDopHeadView)
export class IfsDopHeadResolver {
  @Query(() => [IfsDopHeadView], { nullable: true })
  @UseMiddleware(isAuth)
  async getDopHeadByDopId(
    @Arg('dopId') dopId: string
  ): Promise<IfsDopHeadView[] | undefined> {
    return await IfsDopHeadView.find({ dopId });
  }
}
