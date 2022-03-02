import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsCustomerOrderLineView } from './entities/ifs-customer-order_line.vw';

@Resolver(IfsCustomerOrderLineView)
export class IfsCustomerOrderLineViewResolver {
  @Query(() => [IfsCustomerOrderLineView])
  @UseMiddleware(isAuth)
  async getAllCustomerOrderLine(): Promise<
    IfsCustomerOrderLineView[] | undefined
  > {
    return await IfsCustomerOrderLineView.find();
  }

  @Query(() => IfsCustomerOrderLineView, { nullable: true })
  @UseMiddleware(isAuth)
  async getCustomerOrderLine(
    @Arg('orderNo') orderNo: string
  ): Promise<IfsCustomerOrderLineView | undefined> {
    return await IfsCustomerOrderLineView.findOne(orderNo);
  }
}
