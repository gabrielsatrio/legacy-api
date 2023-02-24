import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Int, Query, Resolver, UseMiddleware } from 'type-graphql';
import { KasbonLogView } from './entities/kasbon-log.vw';

@Resolver(KasbonLogView)
export class PurchaseOrderLogResolver {
  @Query(() => [KasbonLogView], { nullable: true })
  @UseMiddleware(isAuth)
  async getKasbonLog(
    @Arg('kasbonId', () => Int) kasbonId: number
  ): Promise<KasbonLogView[] | undefined> {
    try {
      return await KasbonLogView.findBy({ kasbonId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
