import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_IMS_INV_TRANSACTION_HIST_V')
@ObjectType()
export class ImsInvTransactionHistView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'TRANSACTION_ID' })
  transactionId!: number;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'DESCRIPTION' })
  description?: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field()
  @Column({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'DESTINATION_LOCATION' })
  destinationLocation?: string;

  @Field()
  @Column({ name: 'QUANTITY' })
  quantity!: number;

  @Field({ nullable: true })
  @Column({ name: 'UNIT_MEAS' })
  unitMeas?: string;

  @Field()
  @Column({ name: 'CATCH_QTY' })
  catchQty!: number;

  @Field({ nullable: true })
  @Column({ name: 'CATCH_UNIT_MEAS' })
  catchUnitMeas?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field()
  @Column({ name: 'TRANSACTION_CODE' })
  transactionCode!: string;

  @Field()
  @Column({ name: 'QTY_REVERSED' })
  qtyReversed!: number;

  @Field()
  @Column({ name: 'CREATED_DATE' })
  createdDate!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
