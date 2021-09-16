import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { ShippingView } from './entities/spt-shipping.vw';

@Resolver(ShippingView)
export class ShippingViewResolver {
  @Query(() => [ShippingView])
  @UseMiddleware(isAuth)
  async getAllShippingViews(): // @Arg('contract', () => [String])
  // contract: string[],
  // @Ctx() { req }: Context
  Promise<ShippingView[] | undefined> {
    return ShippingView.find();
  }
}
