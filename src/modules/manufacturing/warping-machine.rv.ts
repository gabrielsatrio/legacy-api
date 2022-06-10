import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { WarpingMachine } from './entities/warping-machine';
import { WarpingMachineInput } from './warping-machine.in';

@Resolver(WarpingMachine)
export class WarpingMachineResolver {
  @Query(() => [WarpingMachine], { nullable: true })
  @UseMiddleware(isAuth)
  async getWarpingMachine(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<WarpingMachine[] | undefined> {
    try {
      return await WarpingMachine.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => WarpingMachine)
  @UseMiddleware(isAuth)
  async createWarpingMachine(
    @Arg('input') input: WarpingMachineInput
  ): Promise<WarpingMachine | undefined> {
    try {
      const data = WarpingMachine.create({
        ...input
      });
      const results = await WarpingMachine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => WarpingMachine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateWarpingMachine(
    @Arg('input') input: WarpingMachineInput
  ): Promise<WarpingMachine | undefined> {
    try {
      const data = await WarpingMachine.findOneBy({
        machineId: input.machineId
      });
      if (!data) throw new Error('No data found.');
      WarpingMachine.merge(data, { ...input });
      const results = await WarpingMachine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => WarpingMachine)
  @UseMiddleware(isAuth)
  async deleteWarpingMachine(
    @Arg('machineId') machineId: string
  ): Promise<WarpingMachine> {
    try {
      const data = await WarpingMachine.findOneBy({
        machineId: machineId
      });
      if (!data) throw new Error('No data found.');
      await WarpingMachine.delete({ machineId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
