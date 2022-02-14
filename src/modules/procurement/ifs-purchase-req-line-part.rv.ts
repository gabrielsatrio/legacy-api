import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsPurchaseReqLinePartView } from './entities/ifs-purchase-req-line-part.vw';

@Resolver(IfsPurchaseReqLinePartView)
export class IfsPurchaseRequisitionResolver {
  @Query(() => [IfsPurchaseReqLinePartView])
  @UseMiddleware(isAuth)
  async getPurchaseReqLinePartByReqNo(
    @Arg('requisitionNo', () => String) requisitionNo: string
  ): Promise<IfsPurchaseReqLinePartView[] | undefined> {
    return await IfsPurchaseReqLinePartView.find({
      where: { requisitionNo },
      order: { lineNo: 'ASC', releaseNo: 'ASC' }
    });
  }
}
