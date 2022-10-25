import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { ProdWarpingIntr } from './entities/warping-intr';

@Resolver(ProdWarpingIntr)
export class ProdWarpingIntrResolver {
  @Query(() => [ProdWarpingIntr], { nullable: true })
  @UseMiddleware(isAuth)
  async getProdWarpingIntrByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<ProdWarpingIntr[] | undefined> {
    try {
      return await ProdWarpingIntr.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
