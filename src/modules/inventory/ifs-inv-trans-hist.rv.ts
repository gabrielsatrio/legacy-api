import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInventoryTransactionHistoryView } from '../inventory/entities/ifs-inv-trans-hist.vw';

@Resolver(IfsInventoryTransactionHistoryView)
export class IfsTransactionHistoryResolver {
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async generateKainPremiumTmp(
    @Arg('date', () => Date) date: Date
  ): Promise<boolean | null> {
    try {
      const sql = `
        BEGIN
          vky_kain_premium_tmp_api.insert__( :p_from);
        END;
      `;
      await ifs.query(sql, [date]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
