import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { MachineLocation } from './entities/apm-machine-location';
import { MachineLocationView } from './entities/apm-machine-location.vw';

@Resolver(MachineLocation)
export class MachineLocationResolver {
  @Query(() => [MachineLocationView])
  @UseMiddleware(isAuth)
  async getAllMachineLocations(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<MachineLocationView[] | undefined> {
    return await MachineLocationView.find({
      where: {
        contract: In(contract)
      }
    });
  }

  @Query(() => MachineLocationView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachineLocation(
    @Arg('locationNo') locationNo: string,
    @Arg('contract') contract: string
  ): Promise<MachineLocationView | undefined> {
    return await MachineLocationView.findOne({ locationNo, contract });
  }
}
