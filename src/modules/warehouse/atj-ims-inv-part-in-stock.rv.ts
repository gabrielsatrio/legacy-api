import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { ImsInvPartInStock } from './entities/atj-ims-inv-part-in-stock';
import { ImsInvPartInStockView } from './entities/atj-ims-inv-part-in-stock.vw';

@Resolver(ImsInvPartInStock)
export class InventoryPartInStockResolver {
  @Query(() => [ImsInvPartInStockView])
  @UseMiddleware(isAuth)
  async GetAllImsInvPartInStock(): Promise<
    ImsInvPartInStockView[] | undefined
  > {
    try {
      return await ImsInvPartInStockView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
