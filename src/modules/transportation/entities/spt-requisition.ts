import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('GBR_SPT_REQUISITION_TAB')
@ObjectType()
export class Requisition extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQ_NO' })
  reqNo!: number;

  @Field()
  @Column({ name: 'DESTINATION_ID' })
  destinationId!: string;

  @Field()
  @Column({ name: 'CUSTOMER_ID' })
  customerId!: string;

  @Field()
  @Column({ name: 'REQUISITION_DATE' })
  requisitionDate!: Date;

  @Field()
  @Column({ name: 'ROLL_QTY' })
  rollQty!: number;

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
  createdBy!: Date;

  @Field()
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt?: Date;

  @Field()
  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt?: Date;
}
