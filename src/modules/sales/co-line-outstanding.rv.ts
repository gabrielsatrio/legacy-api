import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { CoLineOutstandingView } from './entities/co-line-outstanding.vw';

@Resolver(CoLineOutstandingView)
export class CoLineOutstandingViewResolver {
  @Query(() => [CoLineOutstandingView], { nullable: true })
  @UseMiddleware(isAuth)
  async getCoLineOutstanding(): Promise<CoLineOutstandingView[] | undefined> {
    return await CoLineOutstandingView.find({
      order: { orderNo: 'ASC', lineNo: 'ASC', relNo: 'ASC' }
    });
  }
}
