import { isAuth } from '@/middlewares/is-auth';
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
    return await IfsShopOrderOperationView.findBy({ orderNo, operationNo });
  }
}
