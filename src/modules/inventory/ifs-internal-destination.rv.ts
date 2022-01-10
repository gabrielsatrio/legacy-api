import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInternalDestinationView } from './entities/ifs-internal-destination.vw';

@Resolver(IfsInternalDestinationView)
export class InternalCustomerResolver {
  @Query(() => [IfsInternalDestinationView])
  @UseMiddleware(isAuth)
  async getAllInternalDestinations(): Promise<IfsInternalDestinationView[]> {
    return await IfsInternalDestinationView.find({
      order: { destinationId: 'ASC' }
    });
  }
}
