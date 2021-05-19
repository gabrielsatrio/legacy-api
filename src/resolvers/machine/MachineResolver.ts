import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Machine } from '../../entities/Machine';
import { isAuth } from '../../middleware/isAuth';
import { Context } from '../../types/Context';
import DataResponse from '../../types/DataResponse';
import { setErrors } from '../../utils/setErrors';
import { MachineInput } from './types/MachineInput';

@ObjectType()
class MachineResponse extends DataResponse(Machine) {}

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

  @Mutation(() => MachineResponse)
  @UseMiddleware(isAuth)
  async createMachine(
    @Arg('input') input: MachineInput,
    @Ctx() { req }: Context
  ): Promise<MachineResponse | undefined> {
    let result;
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

    try {
      result = await getConnection().query(sql, [
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
    } catch (err) {
      return setErrors(err.message);
    }

    const outMachineId = result[0] as string;
    const data = Machine.findOne(outMachineId);

    return { data };
  }

  @Mutation(() => MachineResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMachine(
    @Arg('machineId') machineId: string,
    @Arg('input') input: MachineInput,
    @Ctx() { req }: Context
  ): Promise<MachineResponse | undefined> {
    let result;
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

    try {
      result = await getConnection().query(sql, [
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
    } catch (err) {
      return setErrors(err.message);
    }

    const outMachineId = result[0];
    const data = Machine.findOne(outMachineId);

    return { data };
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
