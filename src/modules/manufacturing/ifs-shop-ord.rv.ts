import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { IfsShopOrderView } from './entities/ifs-shop-ord.vw';

@Resolver(IfsShopOrderView)
export class ShopOrderResolver {
  @Query(() => [IfsShopOrderView], { nullable: true })
  @UseMiddleware(isAuth)
  async getShopOrder(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('orderNo') orderNo: string
  ): Promise<IfsShopOrderView[] | undefined> {
    return await IfsShopOrderView.find({ contract: In(contract), orderNo });
  }
}
