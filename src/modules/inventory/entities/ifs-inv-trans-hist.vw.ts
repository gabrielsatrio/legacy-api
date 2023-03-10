import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('INVENTORY_TRANSACTION_HIST2')
@ObjectType()
export class IfsInventoryTransactionHistoryView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'TRANSACTION_ID' })
  transactionId!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @Column({ name: 'QUANTITY' })
  quantity!: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_GROSS_LENGTH' })
  grossLength?: number;

  @Field()
  @Column({ name: 'TRANSACTION_CODE' })
  transactionCode!: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_PIECE_NO' })
  ctmPieceNo?: string;

  @Field()
  @Column({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field()
  @Column({ name: 'QTY_REVERSED' })
  qtyReversed!: number;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_JOB_ORDER' })
  ctmJobOrder?: string;

  @Field({ nullable: true })
  @Column({ name: 'ORDER_NO' })
  orderNo?: string;
}
