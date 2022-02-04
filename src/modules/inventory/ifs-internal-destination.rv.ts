import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInternalDestinationView } from './entities/ifs-internal-destination.vw';

@Resolver(IfsInternalDestinationView)
export class IfsInternalCustomerResolver {
  @Query(() => [IfsInternalDestinationView])
  @UseMiddleware(isAuth)
  async getIntDestinationsByContract(
    @Arg('contract') contract: string
  ): Promise<IfsInternalDestinationView[]> {
    return await IfsInternalDestinationView.find({
      where: { contract },
      order: { destinationId: 'ASC' }
    });
  }
}
