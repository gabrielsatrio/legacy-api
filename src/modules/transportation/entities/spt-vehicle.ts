import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_VEHICLE_TAB')
@ObjectType()
export class Vehicle extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'VEHICLE_ID' })
  vehicleId!: string;

  @Field()
  @Column({ name: 'VEHICLE_NAME' })
  vehicleName!: string;

  @Field()
  @Column({ name: 'WEIGHT_CAPACITY' })
  weightCapacity!: number;
}
