import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from './../../utils/map-error';
import { IfsShopOrderView } from './entities/ifs-shop-ord.vw';

@Resolver(IfsShopOrderView)
export class IfsShopOrderResolver {
  @Query(() => [IfsShopOrderView], { nullable: true })
  @UseMiddleware(isAuth)
  async getShopOrder(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('orderNo') orderNo: string
  ): Promise<IfsShopOrderView[] | undefined> {
    return await IfsShopOrderView.find({ contract: In(contract), orderNo });
  }

  @Query(() => IfsShopOrderView, { nullable: true })
  @UseMiddleware(isAuth)
  async getPartNoByOrderNo(
    @Arg('orderNo') orderNo: string
  ): Promise<any | undefined> {
    try {
      const sql = `select SHOP_ORD_API.GET_PART_NO(:orderNo, '*', '*')  as "partNo" from dual`;
      const result = await getConnection().query(sql, [orderNo]);
      const partNo = result[0].partNo;
      return { partNo };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
