import { isAuth } from '@/middlewares/is-auth';
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
    return await YarnInterruptionTransView.find({
      contract: In(contract)
    });
  }

  @Query(() => [YarnInterruptionTransView], { nullable: true })
  @UseMiddleware(isAuth)
  async getYarnInterruptionTransViewFilter(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('machine') machine: string,
    @Arg('reportDate') reportDate: Date
  ): Promise<YarnInterruptionTransView[] | undefined> {
    return await YarnInterruptionTransView.find({
      contract: In(contract),
      machine: machine,
      reportDate: reportDate
    });
  }
}
