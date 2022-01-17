import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInternalCustomerView } from './entities/ifs-internal-customer.vw';

@Resolver(IfsInternalCustomerView)
export class IfsInternalCustomerResolver {
  @Query(() => [IfsInternalCustomerView])
  @UseMiddleware(isAuth)
  async getAllIntCustomers(): Promise<IfsInternalCustomerView[]> {
    return await IfsInternalCustomerView.find({
      order: { intCustomerNo: 'ASC' }
    });
  }
}
