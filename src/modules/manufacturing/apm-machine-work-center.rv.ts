import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { MachineWorkCenter } from './entities/apm-machine-work-center';
import { MachineWorkCenterView } from './entities/apm-machine-work-center.vw';

@Resolver(MachineWorkCenter)
export class MachineWorkCenterResolver {
  @Query(() => [MachineWorkCenterView])
  @UseMiddleware(isAuth)
  async getMachineWorkCentersByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineWorkCenterView[] | undefined> {
    return await MachineWorkCenterView.find({
      where: {
        contract: In(contract)
      }
    });
  }

  @Query(() => MachineWorkCenterView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachineWorkCenter(
    @Arg('workCenterNo') workCenterNo: string,
    @Arg('contract') contract: string
  ): Promise<MachineWorkCenterView | undefined> {
    return await MachineWorkCenterView.findOne({ workCenterNo, contract });
  }
}
