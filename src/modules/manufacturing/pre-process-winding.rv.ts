import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { PreProcessWinding } from './entities/pre-process-winding';
import { PreProcessWindingView } from './entities/pre-process-winding.vw';

@Resolver(PreProcessWinding)
export class PreProcessWindingResolver {
  @Query(() => [PreProcessWinding])
  @UseMiddleware(isAuth)
  async getPreProcessWinding(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('showAll', () => Boolean) showAll: boolean
  ): Promise<PreProcessWinding[] | undefined> {
    try {
      if (showAll)
        return await PreProcessWinding.findBy({ contract: In(contract) });
      return await PreProcessWindingView.findBy({ contract: In(contract) });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
