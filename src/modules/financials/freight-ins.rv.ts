import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { FreightInsView } from './entities/freight-ins.vw';

@Resolver(FreightInsView)
export class PurchaseOrderLogResolver {
  @Query(() => [FreightInsView], { nullable: true })
  @UseMiddleware(isAuth)
  async getFreightIns(
    @Arg('poNumber') poNumber: string
  ): Promise<FreightInsView[] | undefined> {
    try {
      return await FreightInsView.findBy({ poNumber });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
