import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInventoryPartInStockView } from './entities/ifs-inv-part-in-stock.vw';

@Resolver(IfsInventoryPartInStockView)
export class InventoryPartInStockResolver {
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
}
