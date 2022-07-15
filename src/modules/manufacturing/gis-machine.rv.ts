import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { GisMachine } from './entities/gis-machine';
import { GisMachineInput } from './gis-machine.in';

@Resolver(GisMachine)
export class GisMachineResolver {
  @Query(() => [GisMachine], { nullable: true })
  @UseMiddleware(isAuth)
  async getGisMachine(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<GisMachine[] | undefined> {
    try {
      return await GisMachine.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisMachine)
  @UseMiddleware(isAuth)
  async createGisMachine(
    @Arg('input') input: GisMachineInput
  ): Promise<GisMachine | undefined> {
    try {
      const data = GisMachine.create({
        ...input
      });
      const results = await GisMachine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisMachine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateGisMachine(
    @Arg('input') input: GisMachineInput
  ): Promise<GisMachine | undefined> {
    try {
      const data = await GisMachine.findOneBy({
        machineId: input.machineId
      });
      if (!data) throw new Error('No data found.');
      GisMachine.merge(data, { ...input });
      const results = await GisMachine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisMachine)
  @UseMiddleware(isAuth)
  async deleteGisMachine(
    @Arg('contract') contract: string,
    @Arg('machineId') machineId: string
  ): Promise<GisMachine> {
    try {
      const data = await GisMachine.findOneBy({
        contract: contract,
        machineId: machineId
      });
      if (!data) throw new Error('No data found.');
      await GisMachine.delete({ contract, machineId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
