import { ifs } from '@/database/data-sources';
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

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNoOfLotReceived(
    @Arg('contract') contract: string,
    @Arg('orderNo') orderNo: string
  ): Promise<number> {
    let sql;
    try {
      if (contract === 'AGT') {
        sql =
          'SELECT atj_receiving_api.get_jml_kp@ifs8agt(:contract, :order_no) as "noOfReceivedLot" from dual';
      } else {
        sql =
          'SELECT atj_receiving_api.get_jml_kp(:contract, :order_no) as "noOfReceivedLot" from dual';
      }
      const result = await ifs.query(sql, [contract, orderNo]);
      return result[0].noOfReceivedLot;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [IfsShopOrderView], { nullable: true })
  @UseMiddleware(isAuth)
  async getShopOrderByContractOrderNo(
    @Arg('contract') contract: string,
    @Arg('orderNo') orderNo: string
  ): Promise<IfsShopOrderView[] | undefined> {
    try {
      let sql = '';
      if (contract === 'AGT') {
        sql = `SELECT contract as "contract",
                      order_no as "orderNo",
                      part_no as "partNo",
                      org_qty_due as "orgQtyDue",
                      qty_complete as "qtyComplete",
                      job_order as "jobOrder",
                      objid as "objId"
               FROM shop_ord@ifs8agt
               WHERE contract = :contract
               and order_no = :orderNo`;
        return await ifs.query(sql, [contract, orderNo]);
      } else {
        return await IfsShopOrderView.findBy({ contract, orderNo });
      }
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
