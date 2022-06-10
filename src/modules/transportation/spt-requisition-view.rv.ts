import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { RequisitionView } from './entities/spt-requisition.vw';

@Resolver(RequisitionView)
export class RequisitionViewResolver {
  @Query(() => [RequisitionView])
  @UseMiddleware(isAuth)
  async getAllRequisitionViews(): Promise<RequisitionView[] | undefined> {
    try {
      return await RequisitionView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
