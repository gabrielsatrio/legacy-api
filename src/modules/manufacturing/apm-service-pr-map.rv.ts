import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MachineWorkCenter } from './entities/apm-machine-work-center';
import { ServicePrMapView } from './entities/apm-service-pr-map.vw';

@Resolver(MachineWorkCenter)
export class ServicePrMapResolver {
  @Query(() => [ServicePrMapView])
  @UseMiddleware(isAuth)
  async getServivePrMapByReqNo(
    @Arg('requisitionNo') requisitionNo: string
  ): Promise<ServicePrMapView[] | undefined> {
    return await ServicePrMapView.find({ where: { requisitionNo } });
  }
}
