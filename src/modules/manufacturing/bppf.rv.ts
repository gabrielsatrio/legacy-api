import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { BPPF } from './entities/bppf';

@Resolver(BPPF)
export class BPPFResolver {
  @Query(() => [BPPF], { nullable: true })
  @UseMiddleware(isAuth)
  async getBPPF(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<BPPF[] | undefined> {
    return await BPPF.find({
      contract: In(contract)
    });
  }
}
