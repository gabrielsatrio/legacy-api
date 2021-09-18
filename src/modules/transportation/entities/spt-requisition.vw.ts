import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('GBR_SPT_REQUISITION_V')
@ObjectType()
export class RequisitionView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQ_NO' })
  reqNo!: string;

  @Field()
  @Column({ name: 'DESTINATION_ID' })
  destinationId!: string;

  @Field()
  @Column({ name: 'DESTINATION_NAME' })
  destinationName!: string;

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
  @Column({ name: 'METER' })
  meter?: number;

  @Field()
  @Column({ name: 'WEIGHT' })
  weight!: number;

  @Field()
  @Column({ name: 'VOLUME' })
  volume!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy?: string;

  @Field()
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt?: Date;

  @Field()
  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt?: Date;
}
