import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { DDPMachine } from './entities/ddp-machine';

@Resolver(DDPMachine)
export class DDPMachineResolver {
  @Query(() => [DDPMachine], { nullable: true })
  @UseMiddleware(isAuth)
  async getDDPMachine(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<DDPMachine[] | undefined> {
    return await DDPMachine.find({ contract: In(contract) });
  }

  @Query(() => DDPMachine, { nullable: true })
  @UseMiddleware(isAuth)
  async getDDPMachineByMesin(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('mesin') mesin: string
  ): Promise<DDPMachine | undefined> {
    return await DDPMachine.findOne({ contract: In(contract), mesin });
  }
}
