import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_IMS_INV_TRANSACTION_HIST')
@ObjectType()
export class ImsInvTransactionHist extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'TRANSACTION_ID' })
  transactionId!: number;

  @Field()
  @Column({ name: 'TRANSACTION_CODE' })
  transactionCode!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

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

  @Field()
  @Column({ name: 'CATCH_QTY' })
  catchQty!: number;

  @Field()
  @Column({ name: 'QTY_REVERSED' })
  qtyReversed!: number;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field()
  @Column({ name: 'CREATED_DATE' })
  createdDate!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
