import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_ASSIGN_V')
@ObjectType()
export class AssignView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ASSIGN_ID' })
  assignId!: string;

  @Field()
  @PrimaryColumn({ name: 'REQ_NO' })
  reqNo!: string;

  @Field()
  @PrimaryColumn({ name: 'ASSIGN_DATE' })
  assignDate!: Date;

  @Field({ nullable: true })
  @Column({ name: 'ASSIGN_DATE' })
  assignDateBetween?: Date;

  @Field()
  @PrimaryColumn({ name: 'REQUISITION_DATE' })
  requisitionDate!: Date;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'CUSTOMER_ID' })
  customerId!: string;

  @Field()
  @Column({ name: 'DESTINATION_ID' })
  destinationId!: string;

  @Field()
  @Column({ name: 'CUSTOMER_NAME' })
  customerName!: string;

  @Field()
  @Column({ name: 'DESTINATION_NAME' })
  destinationName!: string;

  @Field({ nullable: true })
  @Column({ name: 'VIA' })
  via?: string;

  @Field()
  @Column({ name: 'TOTAL_ROLL' })
  totalRoll!: number;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_SPACE' })
  totalSpace?: number;

  @Field()
  @Column({ name: 'TOTAL_WEIGHT' })
  totalWeight!: number;

  @Field()
  @Column({ name: 'TOTAL_VOLUME' })
  totalVolume!: number;

  @Field({ nullable: true })
  @Column({ name: 'STATUS' })
  status?: string;
}
