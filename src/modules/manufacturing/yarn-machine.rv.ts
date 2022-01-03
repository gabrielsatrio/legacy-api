import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { YarnMachine } from './entities/yarn-machine';
@Resolver(YarnMachine)
export class YarnMachineResolver {
  @Query(() => [YarnMachine], { nullable: true })
  @UseMiddleware(isAuth)
  async getYarnMachine(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<YarnMachine[] | undefined> {
    return await YarnMachine.find({
      contract: In(contract)
    });
  }
}
