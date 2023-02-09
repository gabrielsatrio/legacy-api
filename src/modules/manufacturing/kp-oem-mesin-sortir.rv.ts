import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { KpOemMesinSortirView } from './entities/kp-oem-mesin-sortir';

@Resolver(KpOemMesinSortirView)
export class KpOemMesinSortirResolver {
  @Query(() => [KpOemMesinSortirView])
  @UseMiddleware(isAuth)
  async getKpOemMesinSortir(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<KpOemMesinSortirView[] | undefined> {
    try {
      return KpOemMesinSortirView.findBy({ contract: In(contract) });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
