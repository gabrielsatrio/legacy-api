import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { KpOemMesinSortir } from './entities/kp-oem-mesin-sortir';
import { KpOemMesinSortirView } from './entities/kp-oem-mesin-sortir.vw';
import { KpOemMesinSortirInput } from './kp-oem-mesin-sortir.in';

@Resolver(KpOemMesinSortirView)
export class KpOemMesinSortirResolver {
  @Query(() => [KpOemMesinSortirView])
  @UseMiddleware(isAuth)
  async getKpOemMesinSortir(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('showAll', () => Boolean) showAll: boolean
  ): Promise<KpOemMesinSortirView[] | undefined> {
    try {
      if (showAll)
        return KpOemMesinSortirView.findBy({ contract: In(contract) });
      return KpOemMesinSortirView.findBy({
        contract: In(contract),
        status: 'In Progress'
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => KpOemMesinSortir)
  @UseMiddleware(isAuth)
  async updateKpOemMesinSortir(
    @Arg('input') input: KpOemMesinSortirInput
  ): Promise<KpOemMesinSortir | null> {
    try {
      const data = await KpOemMesinSortir.findOneBy({
        lotBatchNo: input.lotBatchNo
      });
      if (!data) throw new Error('Data not exist!');
      KpOemMesinSortir.merge(data, { ...input });
      const result = await KpOemMesinSortir.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
