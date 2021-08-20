import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { TransactionHistory } from './entities/ifs-inv-trans-hist.vw';

@Resolver(TransactionHistory)
export class TransactionHistoryResolver {
  @Query(() => [TransactionHistory], { nullable: true })
  @UseMiddleware(isAuth)
  async getTransactionHistory(
    @Arg('contract') contract: string,
    @Arg('lotBatchNo') lotBatchNo: string,
    @Arg('transactionCode') transactionCode: string,
    @Arg('locationNo') locationNo: string
  ): Promise<TransactionHistory[] | undefined> {
    return await TransactionHistory.createQueryBuilder('TH')
      .where('TH.CONTRACT = :contract', { contract: contract })
      .andWhere(`TH.LOT_BATCH_NO = :lotBatchNo`, { lotBatchNo: lotBatchNo })
      .andWhere(`TH.TRANSACTION_CODE = :transactionCode`, {
        transactionCode: transactionCode
      })
      .andWhere(`TH.LOCATION_NO like :locationNo`, {
        locationNo: locationNo + '%'
      })
      .getMany();
  }
}
