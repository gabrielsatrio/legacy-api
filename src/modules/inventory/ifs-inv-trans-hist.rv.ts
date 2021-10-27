import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { InventoryTransactionHistory } from '../inventory/entities/ifs-inv-trans-hist.vw';

@Resolver(InventoryTransactionHistory)
export class TransactionHistoryResolver {
  @Query(() => [InventoryTransactionHistory], { nullable: true })
  @UseMiddleware(isAuth)
  async getTransactionHistory(
    @Arg('contract') contract: string,
    @Arg('lotBatchNo') lotBatchNo: string,
    @Arg('transactionCode', () => [String]) transactionCode: string[],
    @Arg('locationNo') locationNo: string
  ): Promise<InventoryTransactionHistory[] | undefined> {
    return await InventoryTransactionHistory.createQueryBuilder('TH')
      .where('TH.CONTRACT = :contract', { contract: contract })
      .andWhere(`TH.LOT_BATCH_NO = :lotBatchNo`, { lotBatchNo: lotBatchNo })
      .andWhere(`TH.TRANSACTION_CODE IN (:...transactionCode)`, {
        transactionCode: transactionCode
      })
      .andWhere(`TH.LOCATION_NO like :locationNo`, {
        locationNo: locationNo + '%'
      })
      .getMany();
  }
}
