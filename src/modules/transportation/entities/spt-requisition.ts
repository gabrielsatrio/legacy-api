import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_REQUISITION_TAB')
@ObjectType()
export class Requisition extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQ_NO' })
  reqNo!: string;

  @Field()
  @Column({ name: 'DESTINATION_ID' })
  destinationId!: string;

  @Field()
  @Column({ name: 'DS' })
  ds!: string;

  @Field({ nullable: true })
  @Column({ name: 'DIVISI' })
  divisi?: string;

  @Field()
  @Column({ name: 'CUSTOMER_ID' })
  customerId!: string;

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

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
