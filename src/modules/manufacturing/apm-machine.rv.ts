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
import { getConnection, In } from 'typeorm';
import { MachineInput } from './apm-machine.in';
import { Machine } from './entities/apm-machine';
import { MachineView } from './entities/apm-machine.vw';

@Resolver(Machine)
export class MachineResolver {
  @Query(() => [MachineView])
  @UseMiddleware(isAuth)
  async getMachinesByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineView[] | undefined> {
    return await MachineView.find({
      where: { contract: In(contract) },
      order: { machineId: 'ASC' }
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

  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async isMachineExist(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string
  ): Promise<boolean> {
    return (await this.getMachine(machineId, contract)) ? true : false;
  }

  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async isMachineDescriptionExist(
    @Arg('contract') contract: string,
    @Arg('description') description: string
  ): Promise<boolean> {
    return (await MachineView.findOne({ contract, description }))
      ? true
      : false;
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getNewMachineId(
    @Arg('contract') contract: string,
    @Arg('categoryId') categoryId: string
  ): Promise<string> {
    try {
      const sql = `SELECT ROB_APM_Machine_API.Get_New_ID(:contract, :categoryId) AS "newMachineId" FROM DUAL`;
      const result = await getConnection().query(sql, [contract, categoryId]);
      return result[0].newMachineId;
    } catch (err) {
      throw new Error(mapError(err));
    }
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
      const result = await Machine.save(data);
      return result;
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
      const result = await Machine.save(data);
      return result;
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
      const data = await Machine.findOne({ machineId, contract });
      if (!data) throw new Error('No data found.');
      await Machine.delete({ machineId, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineView])
  @UseMiddleware(isAuth)
  async getUtilityMachinesByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineView[] | undefined> {
    return await MachineView.find({
      where: { contract: In(contract), departmentId: 'MTC' },
      order: { machineId: 'ASC' }
    });
  }
}
