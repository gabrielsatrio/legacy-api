import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like } from 'typeorm';
import { IfsCustomerOrderLineView } from './entities/ifs-customer-order_line.vw';

@Resolver(IfsCustomerOrderLineView)
export class IfsCustomerOrderLineViewResolver {
  @Query(() => [IfsCustomerOrderLineView], { nullable: true })
  @UseMiddleware(isAuth)
  async getCustomerOrderLineByOrderNo(
    @Arg('orderNo', () => [String]) orderNo: string[]
  ): Promise<IfsCustomerOrderLineView[] | undefined> {
    return await IfsCustomerOrderLineView.find({
      where: { orderNo: In(orderNo), partNo: Like('F%') },
      order: { lineNo: 'ASC' }
    });
  }
}
