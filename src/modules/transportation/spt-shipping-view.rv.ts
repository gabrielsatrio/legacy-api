import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { ShippingView } from './entities/spt-shipping.vw';

@Resolver(ShippingView)
export class ShippingViewResolver {
  @Query(() => [ShippingView])
  @UseMiddleware(isAuth)
  async getAllShippingViews(): Promise<ShippingView[] | undefined> {
    try {
      return await ShippingView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
