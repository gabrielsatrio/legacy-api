import { Field, InputType } from 'type-graphql';
import { Vehicle } from './entities/spt-vehicle';

@InputType()
export class VehicleInput implements Partial<Vehicle> {
  @Field()
  vehicleId!: string;

  @Field()
  vehicleName!: string;

  @Field()
  weightCapacity!: number;
}
