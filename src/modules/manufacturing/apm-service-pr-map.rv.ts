import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like } from 'typeorm';
import { ServicePrMapView } from './entities/apm-service-pr-map.vw';

@Resolver(ServicePrMapView)
export class ServicePrMapResolver {
  @Query(() => [ServicePrMapView])
  @UseMiddleware(isAuth)
  async getServicePrMapByReqNo(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('requisitionNo') requisitionNo: string
  ): Promise<ServicePrMapView[] | undefined> {
    try {
      return await ServicePrMapView.find({
        where: { contract: In(contract), requisitionNo, partNo: Like('NIP%') }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
