import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsCustomerOrderLineView } from './entities/ifs-customer-order_line.vw';

@Resolver(IfsCustomerOrderLineView)
export class IfsCustomerOrderLineViewResolver {
  @Query(() => [IfsCustomerOrderLineView])
  @UseMiddleware(isAuth)
  async getCustomerOrderLine(
    @Arg('orderNo') orderNo: string
  ): Promise<IfsCustomerOrderLineView[]> {
    return await IfsCustomerOrderLineView.find({
      where: { orderNo },
      order: { lineNo: 'ASC' }
    });
  }
}
