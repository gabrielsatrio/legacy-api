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
import { getConnection } from 'typeorm';
import { Vehicle } from './entities/spt-vehicle';
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

  @Mutation(() => Vehicle)
  @UseMiddleware(isAuth)
  async createVehicle(
    @Arg('input') input: VehicleInput,
    @Ctx() { req }: Context
  ): Promise<Vehicle | undefined> {
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
      throw new Error(mapError(err));
    }
    const outVehicleId = result[0] as string;
    const data = Vehicle.findOne(outVehicleId);
    return data;
  }

  @Mutation(() => Vehicle, { nullable: true })
  @UseMiddleware(isAuth)
  async updateVehicle(
    @Arg('input') input: VehicleInput
  ): Promise<Vehicle | undefined> {
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
      throw new Error(mapError(err));
    }
    const outVehicleId = result[0];
    const data = Vehicle.findOne({
      vehicleId: outVehicleId
    });
    return data;
  }

  @Mutation(() => Vehicle)
  @UseMiddleware(isAuth)
  async deleteVehicle(
    @Arg('vehicleId') vehicleId: string
    //@Ctx() { req }: Context
  ): Promise<Vehicle> {
    try {
      //const createdBy: string = req.session.userId;
      const vehicle = await Vehicle.findOne({
        vehicleId
      });
      if (!vehicle) throw new Error('No data found.');
      await Vehicle.delete({ vehicleId });
      return vehicle;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
