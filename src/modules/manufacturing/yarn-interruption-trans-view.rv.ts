import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { YarnInterruptionTransView } from './entities/yarn-interruption-trans.vw';

@Resolver(YarnInterruptionTransView)
export class YarnInterruptionTransViewResolver {
  @Query(() => [YarnInterruptionTransView], { nullable: true })
  @UseMiddleware(isAuth)
  async getYarnInterruptionTransView(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<YarnInterruptionTransView[] | undefined> {
    try {
      return await YarnInterruptionTransView.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [YarnInterruptionTransView], { nullable: true })
  @UseMiddleware(isAuth)
  async getYarnInterruptionTransViewFilter(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('machine') machine: string,
    @Arg('reportDate') reportDate: Date
  ): Promise<YarnInterruptionTransView[] | undefined> {
    try {
      return await YarnInterruptionTransView.findBy({
        contract: In(contract),
        machine,
        reportDate
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
