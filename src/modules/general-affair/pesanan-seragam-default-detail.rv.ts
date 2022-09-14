import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Int, Query, Resolver, UseMiddleware } from 'type-graphql';
import { DefaultSeragamDetailView } from './entities/pesanan-seragam-default-detail.vw';

@Resolver(DefaultSeragamDetailView)
export class DefaultSeragamDetailViewResolver {
  @Query(() => [DefaultSeragamDetailView])
  @UseMiddleware(isAuth)
  async getDefaultSeragam(
    @Arg('tahun', () => String) tahun: string,
    @Arg('periode', () => Int) periode: number
  ): Promise<DefaultSeragamDetailView[] | undefined> {
    try {
      return await DefaultSeragamDetailView.findBy({
        tahun,
        periode
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
