import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { ShopOrder } from './entities/ifs-shop-ord.vw';

@Resolver(ShopOrder)
export class ShopOrderResolver {
  @Query(() => [ShopOrder], { nullable: true })
  @UseMiddleware(isAuth)
  async getShopOrder(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('orderNo') orderNo: string
  ): Promise<ShopOrder[] | undefined> {
    return await ShopOrder.find({ contract: In(contract), orderNo });
  }
}
