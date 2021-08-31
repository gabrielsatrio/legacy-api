import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AssignRequisitionView } from './entities/spt-assign-requisition.vw';

@Resolver(AssignRequisitionView)
export class AssignRequisitionResolver {
  @Query(() => [AssignRequisitionView])
  @UseMiddleware(isAuth)
  async getAllAssignRequisitionViews(
    @Arg('assignId', () => String)
    assignId: string,
    @Arg('requisitionDate', () => Date)
    requisitionDate: Date
  ): Promise<AssignRequisitionView[] | undefined> {
    return AssignRequisitionView.find({
      where: {
        assignId: assignId,
        requisitionDate: requisitionDate
      }
    });
  }

  @Query(() => AssignRequisitionView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignRequisitionView(
    @Arg('assignId') assignId: string,
    @Arg('requisitionDate') requisitionDate: Date,
    @Arg('reqNo') reqNo: number
  ): Promise<AssignRequisitionView | undefined> {
    return await AssignRequisitionView.findOne({
      assignId,
      requisitionDate,
      reqNo
    });
  }
}
