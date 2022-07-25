import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInventoryPartInStockView } from './entities/ifs-inv-part-in-stock.vw';

@Resolver(IfsInventoryPartInStockView)
export class IfsInventoryPartInStockResolver {
  @Query(() => [IfsInventoryPartInStockView], { nullable: true })
  @UseMiddleware(isAuth)
  async getStockByContractAndPart(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<IfsInventoryPartInStockView[] | undefined> {
    return await IfsInventoryPartInStockView.createQueryBuilder('IPIS')
      .where('IPIS.CONTRACT = :contract', { contract: contract })
      .andWhere('IPIS.PART_NO = :partNo', { partNo: partNo })
      .andWhere(`IPIS.LOCATION_NO like 'DYG%'`)
      .andWhere('IPIS.QTY_ONHAND > 0')
      .andWhere('IPIS.QTY_ONHAND != IPIS.QTY_RESERVED')
      .getMany();
  }

  @Query(() => [IfsInventoryPartInStockView], { nullable: true })
  @UseMiddleware(isAuth)
  async getStockByContractPartLocation(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('locationNo') locationNo: string
  ): Promise<IfsInventoryPartInStockView[] | undefined> {
    let sql = '';
    if (contract !== 'AGT') {
      return await IfsInventoryPartInStockView.createQueryBuilder('IPIS')
        .where('IPIS.CONTRACT = :contract', { contract: contract })
        .andWhere('IPIS.PART_NO = :partNo', { partNo: partNo })
        .andWhere(`IPIS.LOCATION_NO like :locationNo||'%'`, {
          locationNo: locationNo
        })
        .andWhere('IPIS.QTY_ONHAND > 0')
        .andWhere('IPIS.QTY_ONHAND != IPIS.QTY_RESERVED')
        .getMany();
    } else {
      sql = `
        SELECT contract      AS "contract",
               part_no       AS "partNo",
               LOT_BATCH_NO  AS "lotBatchNo",
               LOCATION_NO   AS "locationNo",
               QTY_ONHAND    AS "qtyOnhand",
               QTY_RESERVED  AS "qtyReserved",
               RECEIPT_DATE  AS "receiptDate",
               OBJID         AS "objId"
        FROM   INVENTORY_PART_IN_STOCK@ifs8agt
        WHERE  contract = :contract
        AND    part_no = :partNo
        AND    location_no like :locationNo||'%'
        and qty_onhand > 0
        and qty_reserved < qty_onhand
        order by receipt_date
      `;
      const result = await ifs.query(sql, [contract, partNo, locationNo]);
      return result;
    }
  }
}
