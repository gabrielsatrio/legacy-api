import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_UNASSIGN_V')
@ObjectType()
export class UnassignView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQ_NO' })
  reqNo!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DESTINATION_ID' })
  destinationId!: string;

  @Field()
  @Column({ name: 'DESTINATION_NAME' })
  destinationName!: string;

  @Field()
  @Column({ name: 'DS' })
  ds!: string;

  @Field()
  @Column({ name: 'CUSTOMER_ID' })
  customerId!: string;

  @Field()
  @Column({ name: 'CUSTOMER_NAME' })
  customerName!: string;

  @Field()
  @Column({ name: 'REQUISITION_DATE' })
  requisitionDate!: Date;

  @Field()
  @Column({ name: 'ROLL_QTY' })
  rollQty!: number;

  @Field({ nullable: true })
  @Column({ name: 'SPACE' })
  space?: number;

  @Field({ nullable: true })
  @Column({ name: 'METER' })
  meter?: number;

  @Field({ nullable: true })
  @Column({ name: 'WEIGHT' })
  weight?: number;

  @Field({ nullable: true })
  @Column({ name: 'VOLUME' })
  volume?: number;
}
