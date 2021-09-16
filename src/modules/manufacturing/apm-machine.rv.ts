import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { MachineInput } from './apm-machine.in';
import { Machine } from './entities/apm-machine';
import { MachineView } from './entities/apm-machine.vw';

@Resolver(Machine)
export class MachineResolver {
  @Query(() => [MachineView])
  @UseMiddleware(isAuth)
  async getAllMachines(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<MachineView[] | undefined> {
    return await MachineView.find({
      where: {
        contract: In(contract)
      }
    });
  }

  @Query(() => MachineView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachine(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string
  ): Promise<MachineView | undefined> {
    return await MachineView.findOne({ machineId, contract });
  }

  @Mutation(() => Machine)
  @UseMiddleware(isAuth)
  async createMachine(
    @Arg('input') input: MachineInput,
    @Ctx() { req }: Context
  ): Promise<Machine | undefined> {
    try {
      const data = Machine.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const results = await Machine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Machine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMachine(
    @Arg('input') input: MachineInput
  ): Promise<Machine | undefined> {
    try {
      const data = await Machine.findOne({
        machineId: input.machineId,
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      Machine.merge(data, input);
      const results = await Machine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Machine)
  @UseMiddleware(isAuth)
  async deleteMachine(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string
  ): Promise<Machine> {
    try {
      const data = await Machine.findOne({
        machineId,
        contract
      });
      if (!data) throw new Error('No data found.');
      await Machine.delete({ machineId, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
