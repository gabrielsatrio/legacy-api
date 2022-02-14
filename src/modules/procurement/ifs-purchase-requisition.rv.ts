import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { IfsPurchaseRequisitionView } from './entities/ifs-purchase-requisition.vw';

@Resolver(IfsPurchaseRequisitionView)
export class IfsPurchaseRequisitionResolver {
  @Query(() => [IfsPurchaseRequisitionView])
  @UseMiddleware(isAuth)
  async getPurchaseRequisitionsByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<IfsPurchaseRequisitionView[] | undefined> {
    return await IfsPurchaseRequisitionView.find({
      where: { contract: In(contract) },
      order: { requisitionNo: 'ASC' }
    });
  }
}
