import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { CustomerInfo } from './entities/ifs-customer-info.vw';

@Resolver(CustomerInfo)
export class CustomerInfoResolver {
  @Query(() => [CustomerInfo])
  @UseMiddleware(isAuth)
  async getAllCustomerInfo(): Promise<CustomerInfo[] | undefined> {
    return await CustomerInfo.find();
  }

  @Query(() => CustomerInfo, { nullable: true })
  @UseMiddleware(isAuth)
  async getCustomerInfo(
    @Arg('customerId') customerId: string
  ): Promise<CustomerInfo | undefined> {
    return await CustomerInfo.findOne(customerId);
  }
}
