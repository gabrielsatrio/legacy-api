import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { ShippingView } from './entities/spt-shipping.vw';

@Resolver(ShippingView)
export class ShippingViewResolver {
  @Query(() => [ShippingView])
  @UseMiddleware(isAuth)
  async getAllShippingViews(): Promise<ShippingView[] | undefined> {
    return await ShippingView.find();
  }
}
