import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsMaterialRequisitionView } from './entities/ifs-material-requisition.vw';

@Resolver(IfsMaterialRequisitionView)
export class IfsMaterialRequisitionResolver {
  @Query(() => [IfsMaterialRequisitionView], { nullable: true })
  @UseMiddleware(isAuth)
  async getMaterialRequisition(
    @Arg('orderNo') orderNo: string
  ): Promise<IfsMaterialRequisitionView[] | undefined> {
    return await IfsMaterialRequisitionView.findBy({ orderNo });
  }
}
