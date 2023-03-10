import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ImsWarehouseBayBinView } from './entities/atj-ims-warehoouse.vw';
import { ImsWarehouseBayBin } from './entities/atj-ims-warehouse';

@Resolver(ImsWarehouseBayBin)
export class ImsWarehouseBayBinResolver {
  @Query(() => [ImsWarehouseBayBinView])
  @UseMiddleware(isAuth)
  async getAllImsWarehouse(): Promise<ImsWarehouseBayBinView[] | undefined> {
    try {
      return await ImsWarehouseBayBinView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ImsWarehouseBayBinView])
  @UseMiddleware(isAuth)
  async getImsWarehouseBySite(
    @Arg('contract', () => String) contract: string
  ): Promise<ImsWarehouseBayBinView[] | undefined> {
    try {
      return await ImsWarehouseBayBinView.findBy({ contract });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
