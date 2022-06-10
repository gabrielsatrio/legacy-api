import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AssignRequisitionView } from './entities/spt-assign-requisition.vw';

@Resolver(AssignRequisitionView)
export class AssignRequisitionResolver {
  @Query(() => [AssignRequisitionView])
  @UseMiddleware(isAuth)
  async getAllAssignRequisitionViews(
    @Arg('assignId', () => String)
    assignId: string,
    @Arg('assignDate', () => Date)
    assignDate: Date
  ): Promise<AssignRequisitionView[] | undefined> {
    try {
      return await AssignRequisitionView.find({
        where: {
          assignId,
          assignDate
        }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AssignRequisitionView])
  @UseMiddleware(isAuth)
  async getAllAssignRequisitionViewsNoFilter(): Promise<
    AssignRequisitionView[] | undefined
  > {
    try {
      return await AssignRequisitionView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => AssignRequisitionView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignRequisitionView(
    @Arg('assignId') assignId: string,
    @Arg('assignDate') assignDate: Date
  ): Promise<AssignRequisitionView | null> {
    try {
      return await AssignRequisitionView.findOneBy({
        assignId,
        assignDate
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => AssignRequisitionView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignRequisitionViewByReqNo(
    @Arg('reqNo') reqNo: string,
    @Arg('requisitionDate') requisitionDate: Date
  ): Promise<AssignRequisitionView | null> {
    try {
      return await AssignRequisitionView.findOneBy({
        reqNo,
        requisitionDate
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
