import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsShopOrderOperationView } from './entities/ifs-shop-ord-operation.vw';

@Resolver(IfsShopOrderOperationView)
export class IfsShopOrderOperationResolver {
  @Query(() => [IfsShopOrderOperationView], { nullable: true })
  @UseMiddleware(isAuth)
  async getShopOrderOperationByOrderNoOperationNo(
    @Arg('orderNo') orderNo: string,
    @Arg('operationNo') operationNo: number
  ): Promise<IfsShopOrderOperationView[] | undefined> {
    try {
      return await IfsShopOrderOperationView.findBy({ orderNo, operationNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
