import { isAuth } from '@/middleware/isAuth';
import { Context } from '@/types/Context';
import DataDeleteResponse from '@/types/DataDeleteResponse';
import DataResponse from '@/types/DataResponse';
import { setErrors } from '@/utils/setErrors';
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
import { MachineInput } from './types/MachineInput';

@ObjectType()
class MachineResponse extends DataResponse(Machine) {}

@ObjectType()
class MachineDeleteResponse extends DataDeleteResponse() {}

@Resolver(Machine)
export class MachineResolver {
  @Query(() => [Machine])
  @UseMiddleware(isAuth)
  async getMachines(): Promise<Machine[] | undefined> {
    return Machine.find({ relations: ['category', 'location'] });
  }

  @Query(() => Machine, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachine(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string
  ): Promise<Machine | undefined> {
    return await Machine.findOne(
      { machineId, contract },
      { relations: ['category', 'location'] }
    );
  }

  @Mutation(() => MachineResponse)
  @UseMiddleware(isAuth)
  async createMachine(
    @Arg('input') input: MachineInput,
    @Ctx() { req }: Context
  ): Promise<MachineResponse | undefined> {
    let result;
    const createdBy: string = req.session.userId;
    const sql = `
      BEGIN
        ROB_APM_Machine_API.Create__(
          :machineId,
          :contract,
          :description,
          :categoryId,
          :mType,
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
        input.mType,
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
      return setErrors(err.message);
    }
    const outMachineId = result[0] as string;
    const data = Machine.findOne({
      machineId: outMachineId,
      contract: input.contract
    });
    return { data };
  }

  @Mutation(() => MachineResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMachine(
    @Arg('input') input: MachineInput
  ): Promise<MachineResponse | undefined> {
    let result;
    const machine = await Machine.findOne({
      machineId: input.machineId,
      contract: input.contract
    });
    if (!machine) {
      return undefined;
    }
    const sql = `
      BEGIN
        Rob_APM_Machine_API.Update__(
          :machineId,
          :contract,
          :description,
          :categoryId,
          :mType,
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
        input.mType,
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
      return setErrors(err.message);
    }
    const outMachineId = result[0];
    const data = Machine.findOne({
      machineId: outMachineId,
      contract: input.contract
    });
    return { data };
  }

  @Mutation(() => MachineDeleteResponse)
  @UseMiddleware(isAuth)
  async deleteMachine(
    @Arg('machineId') machineId: string,
    @Arg('contract') contract: string,
    @Ctx() { req }: Context
  ): Promise<MachineDeleteResponse> {
    const createdBy: string = req.session.userId;
    const machine = await Machine.findOne({
      machineId,
      contract,
      createdBy
    });
    if (!machine) {
      return setErrors('Data does not exist.');
    }
    try {
      await Machine.delete({ machineId, contract, createdBy });
      return { data: { isDeleted: true } };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
