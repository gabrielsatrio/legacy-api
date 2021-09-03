import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
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
    let result;
    const createdBy: string = req.session.userId;
    const sql = `
      BEGIN
        ROB_APM_Machine_API.Create__(
          :machineId,
          :contract,
          :description,
          :categoryId,
          :type,
          :makerId,
          :serialNo,
          :yearMade,
          :purchaseDate,
          :departmentId,
          :locationNo,
          :status,
          :note,
          :image1,
          :image2,
          :controller,
          :launchMethod,
          :rapierType,
          :widthInCm,
          :totalAccumulator,
          :totalSelector,
          :totalHarness,
          :endCapacity,
          :gang,
          :gauge,
          :feeder,
          :totalNeedles,
          :yarnFeederType,
          :needleSensor,
          :capacityInM,
          :capacityInKg,
          :settingSystem,
          :totalChamber,
          :usableWidth,
          :nominalWidth,
          :position,
          :createdBy,
          :outMachineId);
      END;
    `;
    try {
      result = await getConnection().query(sql, [
        input.machineId,
        input.contract,
        input.description,
        input.categoryId,
        input.type,
        input.makerId,
        input.serialNo,
        input.yearMade,
        input.purchaseDate,
        input.departmentId,
        input.locationNo,
        input.status,
        input.note,
        input.image1,
        input.image2,
        input.controller,
        input.launchMethod,
        input.rapierType,
        input.widthInCm,
        input.totalAccumulator,
        input.totalSelector,
        input.totalHarness,
        input.endCapacity,
        input.gang,
        input.gauge,
        input.feeder,
        input.totalNeedles,
        input.yarnFeederType,
        input.needleSensor,
        input.capacityInM,
        input.capacityInKg,
        input.settingSystem,
        input.totalChamber,
        input.usableWidth,
        input.nominalWidth,
        input.position,
        createdBy,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err.message));
    }
    const outMachineId = result[0] as string;
    const data = Machine.findOne({
      machineId: outMachineId,
      contract: input.contract
    });
    return data;
  }

  @Mutation(() => Machine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMachine(
    @Arg('input') input: MachineInput
  ): Promise<Machine | undefined> {
    let result;
    const machine = await Machine.findOne({
      machineId: input.machineId,
      contract: input.contract
    });
    if (!machine) {
      throw new Error('No data found.');
    }
    const sql = `
      BEGIN
        Rob_APM_Machine_API.Update__(
          :machineId,
          :contract,
          :description,
          :categoryId,
          :type,
          :makerId,
          :serialNo,
          :yearMade,
          :purchaseDate,
          :departmentId,
          :locationNo,
          :status,
          :note,
          :image1,
          :image2,
          :controller,
          :launchMethod,
          :rapierType,
          :widthInCm,
          :totalAccumulator,
          :totalSelector,
          :totalHarness,
          :endCapacity,
          :gang,
          :gauge,
          :feeder,
          :totalNeedles,
          :yarnFeederType,
          :needleSensor,
          :capacityInM,
          :capacityInKg,
          :settingSystem,
          :totalChamber,
          :usableWidth,
          :nominalWidth,
          :position,
          :outMachineId);
      END;
    `;
    try {
      result = await getConnection().query(sql, [
        input.machineId,
        input.contract,
        input.description,
        input.categoryId,
        input.type,
        input.makerId,
        input.serialNo,
        input.yearMade,
        input.purchaseDate,
        input.departmentId,
        input.locationNo,
        input.status,
        input.note,
        input.image1,
        input.image2,
        input.controller,
        input.launchMethod,
        input.rapierType,
        input.widthInCm,
        input.totalAccumulator,
        input.totalSelector,
        input.totalHarness,
        input.endCapacity,
        input.gang,
        input.gauge,
        input.feeder,
        input.totalNeedles,
        input.yarnFeederType,
        input.needleSensor,
        input.capacityInM,
        input.capacityInKg,
        input.settingSystem,
        input.totalChamber,
        input.usableWidth,
        input.nominalWidth,
        input.position,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err.message));
    }
    const outMachineId = result[0];
    const data = Machine.findOne({
      machineId: outMachineId,
      contract: input.contract
    });
    return data;
  }

  @Mutation(() => Machine)
  @UseMiddleware(isAuth)
  async deleteMachine(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string,
    @Ctx() { req }: Context
  ): Promise<Machine> {
    const createdBy: string = req.session.userId;
    const data = await Machine.findOne({
      machineId,
      contract,
      createdBy
    });
    if (!data) throw new Error('No data found.');
    try {
      await Machine.delete({ machineId, contract, createdBy });
      return data;
    } catch (err) {
      throw new Error(mapError(err.message));
    }
  }
}
