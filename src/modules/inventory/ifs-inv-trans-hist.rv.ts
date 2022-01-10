import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInventoryTransactionHistoryView } from '../inventory/entities/ifs-inv-trans-hist.vw';

@Resolver(IfsInventoryTransactionHistoryView)
export class TransactionHistoryResolver {
  @Query(() => [IfsInventoryTransactionHistoryView], { nullable: true })
  @UseMiddleware(isAuth)
  async getTransactionHistory(
    @Arg('contract') contract: string,
    @Arg('lotBatchNo') lotBatchNo: string,
    @Arg('transactionCode', () => [String]) transactionCode: string[],
    @Arg('locationNo') locationNo: string
  ): Promise<IfsInventoryTransactionHistoryView[] | undefined> {
    return await IfsInventoryTransactionHistoryView.createQueryBuilder('TH')
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

  @Query(() => [IfsInventoryTransactionHistoryView], { nullable: true })
  @UseMiddleware(isAuth)
  async getByLotBatchQC(
    @Arg('contract') contract: string,
    @Arg('lotBatchNo') lotBatchNo: string,
    @Arg('transactionCode') transactionCode: string
  ): Promise<IfsInventoryTransactionHistoryView[] | undefined> {
    return await IfsInventoryTransactionHistoryView.createQueryBuilder('TH')
      .where('TH.CONTRACT = :contract', { contract })
      .andWhere(`TH.LOT_BATCH_NO = :lotBatchNo`, { lotBatchNo })
      .andWhere(`TH.TRANSACTION_CODE = :transactionCode`, {
        transactionCode
      })
      .andWhere(`TH.QTY_REVERSED= 0`)
      .getMany();
  }
}
