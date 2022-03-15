import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsCoOutstandingView } from './entities/ifs-customer-order-line-outstanding.vw';

@Resolver(IfsCoOutstandingView)
export class IfsCoOutstandingViewResolver {
  @Query(() => [IfsCoOutstandingView], { nullable: true })
  @UseMiddleware(isAuth)
  async getCustomerOrderLineOutstanding(): Promise<
    IfsCoOutstandingView[] | undefined
  > {
    return await IfsCoOutstandingView.find({
      order: { orderNo: 'ASC', lineNo: 'ASC', relNo: 'ASC' }
    });
  }
}
