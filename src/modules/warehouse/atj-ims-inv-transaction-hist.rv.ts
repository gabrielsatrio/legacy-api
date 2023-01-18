import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Int, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ImsInvTransactionHist } from './entities/atj-ims-inv-transaction-hist';
import { ImsInvTransactionHistView } from './entities/atj-ims-inv-transaction-hist.vw';

@Resolver(ImsInvTransactionHist)
export class ImsInvTransactionHistResolver {
  @Query(() => ImsInvTransactionHistView)
  @UseMiddleware(isAuth)
  async getImsInvTransactionHistById(
    @Arg('transactionId', () => Int) transactionId: number
  ): Promise<ImsInvTransactionHistView | null> {
    try {
      return await ImsInvTransactionHistView.findOneBy({ transactionId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ImsInvTransactionHistView])
  @UseMiddleware(isAuth)
  async getImsInvTransactionHistByLotLoc(
    @Arg('contract', () => String) contract: string,
    @Arg('lotBatchNo', () => String) lotBatchNo: string,
    @Arg('locationNo', () => String) locationNo: string
  ): Promise<ImsInvTransactionHistView[] | undefined> {
    try {
      return await ImsInvTransactionHistView.findBy({
        contract,
        lotBatchNo,
        locationNo
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
