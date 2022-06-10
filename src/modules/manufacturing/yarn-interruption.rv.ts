import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
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
    try {
      return await YarnInterruption.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
