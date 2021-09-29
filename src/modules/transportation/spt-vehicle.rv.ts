import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Vehicle } from './entities/spt-vehicle';
import { VehicleInput } from './spt-vehicle.in';

@Resolver(Vehicle)
export class VehicleResolver {
  @Query(() => [Vehicle])
  @UseMiddleware(isAuth)
  async getAllVehicles(): Promise<Vehicle[] | undefined> {
    return await Vehicle.find();
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
    @Arg('input') input: VehicleInput
  ): Promise<Vehicle | undefined> {
    try {
      const sql = `
    BEGIN
      GBR_SPT_API.Create_Vehicle(:vehicleId, :vehicleName, :weightCapacity, :outVehicleId);
    END;
  `;
      const result = await getConnection().query(sql, [
        input.vehicleId,
        input.vehicleName,
        input.weightCapacity,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outVehicleId = result[0] as string;
      const data = Vehicle.findOne(outVehicleId);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Vehicle, { nullable: true })
  @UseMiddleware(isAuth)
  async updateVehicle(
    @Arg('input') input: VehicleInput
  ): Promise<Vehicle | undefined> {
    try {
      const vehicle = await Vehicle.findOne({ vehicleId: input.vehicleId });
      if (!vehicle) throw new Error('No data found.');
      const sql = `
      BEGIN
        GBR_SPT_API.UPDATE_VEHICLE(:vehicleId, :vehicleName, :weightCapacity, :outVehicleId);
      END;
    `;
      const result = await getConnection().query(sql, [
        input.vehicleId,
        input.vehicleName,
        input.weightCapacity,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outVehicleId = result[0];
      const data = Vehicle.findOne({ vehicleId: outVehicleId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Vehicle)
  @UseMiddleware(isAuth)
  async deleteVehicle(@Arg('vehicleId') vehicleId: string): Promise<Vehicle> {
    try {
      const vehicle = await Vehicle.findOne({ vehicleId });
      if (!vehicle) throw new Error('No data found.');
      await Vehicle.delete({ vehicleId });
      return vehicle;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
