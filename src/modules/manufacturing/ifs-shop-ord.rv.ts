import { ifs } from '@/config/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { IfsShopOrderView } from './entities/ifs-shop-ord.vw';

@Resolver(IfsShopOrderView)
export class IfsShopOrderResolver {
  @Query(() => [IfsShopOrderView], { nullable: true })
  @UseMiddleware(isAuth)
  async getShopOrder(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('orderNo') orderNo: string
  ): Promise<IfsShopOrderView[] | undefined> {
    return await IfsShopOrderView.findBy({ contract: In(contract), orderNo });
  }

  @Query(() => IfsShopOrderView, { nullable: true })
  @UseMiddleware(isAuth)
  async getPartNoByOrderNo(
    @Arg('orderNo') orderNo: string
  ): Promise<Record<string, string | undefined>> {
    try {
      const sql = `SELECT SHOP_ORD_API.GET_PART_NO(:orderNo, '*', '*')  as "partNo" FROM DUAL`;
      const result = await ifs.query(sql, [orderNo]);
      const partNo = result[0].partNo;
      return { partNo };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
