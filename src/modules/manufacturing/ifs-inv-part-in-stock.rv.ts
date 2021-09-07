import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { InventoryPartInStock } from './entities/ifs-inv-part-in-stock.vw';

@Resolver(InventoryPartInStock)
export class InventoryPartInStockResolver {
  @Query(() => [InventoryPartInStock], { nullable: true })
  @UseMiddleware(isAuth)
  async getStockByContractAndPart(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<InventoryPartInStock[] | undefined> {
    return await InventoryPartInStock.createQueryBuilder('IPIS')
      .where('IPIS.CONTRACT = :contract', { contract: contract })
      .andWhere('IPIS.PART_NO = :partNo', { partNo: partNo })
      .andWhere(`IPIS.LOCATION_NO like 'DYG%'`)
      .andWhere('IPIS.QTY_ONHAND > 0')
      .getMany();
  }
}
