import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { YarnInterruption } from './entities/yarn-interruption';

@Resolver(YarnInterruption)
export class YarnInterruptionResolver {
  @Query(() => [YarnInterruption], { nullable: true })
  @UseMiddleware(isAuth)
  async getYarnInterruption(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<YarnInterruption[] | undefined> {
    return await YarnInterruption.findBy({
      contract: In(contract)
    });
  }
}
