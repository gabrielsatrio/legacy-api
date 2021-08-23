import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { setErrors } from '@/utils/set-errors';
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
import { Vehicle } from './entities/spt-vehicle';
import { VehicleResponse } from './spt-vehicle.dr';
import { VehicleInput } from './spt-vehicle.in';

@Resolver(Vehicle)
export class VehicleResolver {
  @Query(() => [Vehicle])
  @UseMiddleware(isAuth)
  async getAllVehicles(): // @Arg('contract', () => [String])
  // contract: string[],
  // @Ctx() { req }: Context
  Promise<Vehicle[] | undefined> {
    return Vehicle.find();
  }

  @Query(() => Vehicle, { nullable: true })
  @UseMiddleware(isAuth)
  async getVehicle(
    @Arg('vehicleId') vehicleId: string
  ): Promise<Vehicle | undefined> {
    return await Vehicle.findOne(vehicleId);
  }

  @Mutation(() => VehicleResponse)
  @UseMiddleware(isAuth)
  async createVehicle(
    @Arg('input') input: VehicleInput,
    @Ctx() { req }: Context
  ): Promise<VehicleResponse | undefined> {
    let result;
    //const createdBy: string = req.session.userId;
    const sql = `
    BEGIN
      GBR_SPT_API.Create_Vehicle(:vehicleId, :vehicleName, :weightCapacity, :outVehicleId);
    END;
  `;

    try {
      result = await getConnection().query(sql, [
        input.vehicleId,
        input.vehicleName,
        input.weightCapacity,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }
    const outVehicleId = result[0] as string;
    const data = Vehicle.findOne(outVehicleId);
    return { success: true, data };
  }

  @Mutation(() => VehicleResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateVehicle(
    @Arg('input') input: VehicleInput
  ): Promise<VehicleResponse | undefined> {
    let result;
    const vehicle = await Vehicle.findOne({ vehicleId: input.vehicleId });
    if (!vehicle) {
      return undefined;
    }

    const sql = `
      BEGIN
        GBR_SPT_API.UPDATE_VEHICLE(:vehicleId, :vehicleName, :weightCapacity, :outVehicleId);
      END;
    `;
    try {
      result = await getConnection().query(sql, [
        input.vehicleId,
        input.vehicleName,
        input.weightCapacity,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }
    const outVehicleId = result[0];
    const data = Vehicle.findOne({
      vehicleId: outVehicleId
    });
    return { success: true, data };
  }

  @Mutation(() => VehicleResponse)
  @UseMiddleware(isAuth)
  async deleteVehicle(
    @Arg('vehicleId') vehicleId: string
    //@Ctx() { req }: Context
  ): Promise<VehicleResponse> {
    //const createdBy: string = req.session.userId;
    const vehicle = await Vehicle.findOne({
      vehicleId
    });
    if (!vehicle) return setErrors('No data found.');
    try {
      await Vehicle.delete({ vehicleId });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
