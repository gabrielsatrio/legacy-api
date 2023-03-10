import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import dayjs from 'dayjs';
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
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkMachineExist(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string
  ): Promise<boolean> {
    try {
      return (await this.getMachine(machineId, contract)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkMachineDescriptionExist(
    @Arg('contract') contract: string,
    @Arg('description') description: string
  ): Promise<boolean> {
    try {
      return (await MachineView.findOneBy({ contract, description }))
        ? true
        : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineView])
  @UseMiddleware(isAuth)
  async getMachinesByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineView[] | undefined> {
    try {
      return await MachineView.find({
        where: { contract: In(contract) },
        order: { machineId: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => MachineView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachine(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string
  ): Promise<MachineView | null> {
    try {
      return await MachineView.findOneBy({ machineId, contract });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getNewMachineId(
    @Arg('contract') contract: string,
    @Arg('categoryId') categoryId: string
  ): Promise<string> {
    try {
      const sql = `SELECT ROB_APM_Machine_API.Get_New_ID(:contract, :categoryId) AS "newMachineId" FROM DUAL`;
      const result = await ifs.query(sql, [contract, categoryId]);
      return result[0].newMachineId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineView])
  @UseMiddleware(isAuth)
  async getUtilityMachinesByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineView[] | undefined> {
    try {
      return await MachineView.find({
        where: { contract: In(contract), departmentId: 'UTL' },
        order: { machineId: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineView])
  @UseMiddleware(isAuth)
  async getMachinesForServicePRMap(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineView[] | undefined> {
    try {
      return await MachineView.find({
        where: { contract: In(contract) },
        order: { machineId: 'ASC' }
      });
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
      const existingData = await Machine.findOneBy({
        machineId: input.machineId,
        contract: input.contract
      });
      if (existingData) throw new Error('Data already exists.');
      const data = Machine.create({
        ...input,
        purchaseDate: dayjs(input.purchaseDate).format('YYYY-MM-DD'),
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
      const data = await Machine.findOneBy({
        machineId: input.machineId,
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      Machine.merge(data, {
        ...input,
        purchaseDate: dayjs(input.purchaseDate).format('YYYY-MM-DD')
      });
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
      const data = await Machine.findOneBy({ machineId, contract });
      if (!data) throw new Error('No data found.');
      await Machine.delete({ machineId, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
