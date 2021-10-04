import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_SHIPPING_TAB')
@ObjectType()
export class Shipping extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'SHIPPING_ID' })
  shippingId!: string;

  @Field()
  @Column({ name: 'EXPEDITION_ID' })
  expeditionId!: string;

  @Field()
  @Column({ name: 'VEHICLE_ID' })
  vehicleId!: string;

  @Field()
  @Column({ name: 'DESTINATION_ID' })
  destinationId!: string;

  @Field()
  @Column({ name: 'RATE' })
  rate!: number;

  @Field()
  @Column({ name: 'MULTIDROP_RATE' })
  multidropRate!: number;
}
