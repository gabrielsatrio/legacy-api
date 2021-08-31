import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { RequisitionView } from './entities/spt-requisition.vw';

@Resolver(RequisitionView)
export class RequisitionViewResolver {
  @Query(() => [RequisitionView])
  @UseMiddleware(isAuth)
  async getAllRequisitionViews(): // @Arg('contract', () => [String])
  // contract: string[],
  // @Ctx() { req }: Context
  Promise<RequisitionView[] | undefined> {
    return RequisitionView.find();
  }
}
