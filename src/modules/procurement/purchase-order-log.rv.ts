import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { PurchaseOrderLogView } from './entities/purchase-order-log.vw';

@Resolver(PurchaseOrderLogView)
export class IfsShopOrderOperationResolver {
  @Query(() => [PurchaseOrderLogView], { nullable: true })
  @UseMiddleware(isAuth)
  async getPOHistory(
    @Arg('poNumber') poNumber: string,
    @Arg('contract') contract: string
  ): Promise<PurchaseOrderLogView[] | undefined> {
    try {
      return await PurchaseOrderLogView.findBy({ poNumber, contract });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
