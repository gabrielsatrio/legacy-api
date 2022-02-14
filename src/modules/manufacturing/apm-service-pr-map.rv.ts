import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { ServicePrMapView } from './entities/apm-service-pr-map.vw';

@Resolver(ServicePrMapView)
export class ServicePrMapResolver {
  @Query(() => [ServicePrMapView])
  @UseMiddleware(isAuth)
  async getServicePrMapByReqNo(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('requisitionNo') requisitionNo: string
  ): Promise<ServicePrMapView[] | undefined> {
    return await ServicePrMapView.find({
      where: { contract: In(contract), requisitionNo }
    });
  }
}
