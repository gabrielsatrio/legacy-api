import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Machine } from '../../entities/Machine';
import { isAuth } from '../../middleware/isAuth';
import { Context } from '../../types/Context';
import { MachineInput } from './types/MachineInput';

@Resolver(Machine)
export class MachineResolver {
  @Query(() => [Machine])
  @UseMiddleware(isAuth)
  async getMachines(): Promise<Machine[] | undefined> {
    return await Machine.find();
  }

  @Query(() => Machine, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachine(
    @Arg('machineId') machineId: string
  ): Promise<Machine | undefined> {
    return await Machine.findOne(machineId);
  }

  @Mutation(() => Machine)
  @UseMiddleware(isAuth)
  async createMachine(
    @Arg('input') input: MachineInput,
    @Ctx() { req }: Context
  ): Promise<Machine> {
    const {
      machineId,
      machineName,
      machineType,
      makerId,
      yearMade,
      serialNo,
      controller,
      launchMethod,
      image,
      isActive,
      remarks
    } = input;
    const createdBy: string = req.session.userId;

    const sql = `
      BEGIN
        Rob_Machine_API.Create__(:machineId, :machineName, :machineType, :makerId, :yearMade, :serialNo, :controller, :launchMethod, :image, :isActive, :remarks, :createdBy, :outMachineId);
      END;
    `;

    const result = await getConnection().query(sql, [
      machineId,
      machineName,
      machineType,
      makerId,
      yearMade,
      serialNo,
      controller,
      launchMethod,
      image,
      isActive ? 1 : 0,
      remarks,
      createdBy,
      { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    ]);

    const outMachineId = result[0];
    const data = Machine.findOneOrFail(outMachineId);
    return data;
  }

  @Mutation(() => Machine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMachine(
    @Arg('machineId') machineId: string,
    @Arg('input') input: MachineInput,
    @Ctx() { req }: Context
  ): Promise<Machine | undefined> {
    const {
      machineName,
      machineType,
      makerId,
      yearMade,
      serialNo,
      controller,
      launchMethod,
      image,
      isActive,
      remarks
    } = input;

    const machine = await Machine.findOne({
      machineId,
      createdBy: req.session.userId
    });

    if (!machine) {
      return undefined;
    }

    const sql = `
      BEGIN
        Rob_Machine_API.Update__(:machineId, :machineName, :machineType, :makerId, :yearMade, :serialNo, :controller, :launchMethod, :image, :isActive, :remarks, :outMachineId);
      END;
    `;

    const result = await getConnection().query(sql, [
      machineId,
      machineName,
      machineType,
      makerId,
      yearMade,
      serialNo,
      controller,
      launchMethod,
      image,
      isActive ? 1 : 0,
      remarks,
      { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    ]);

    const outMachineId = result[0];
    const data = Machine.findOneOrFail(outMachineId);
    return data;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteMachine(@Arg('machineId') machineId: string): Promise<boolean> {
    try {
      await Machine.delete(machineId);
      return true;
    } catch (err) {
      return false;
    }
  }
}
