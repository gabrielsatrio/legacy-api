import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsDopSupplyShopOrdView } from './entities/ifs-dop-supply-shop-ord.vw';

@Resolver(IfsDopSupplyShopOrdView)
export class IfsDopSupplyShopOrdResolver {
  @Query(() => [IfsDopSupplyShopOrdView], { nullable: true })
  @UseMiddleware(isAuth)
  async getDopSupplyShopOrdByOrderNo(
    @Arg('orderNo') orderNo: string
  ): Promise<IfsDopSupplyShopOrdView[] | undefined> {
    return await IfsDopSupplyShopOrdView.find({ orderNo });
  }
}
