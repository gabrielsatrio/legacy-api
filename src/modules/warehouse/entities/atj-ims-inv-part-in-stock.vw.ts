import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_IMS_INV_PART_IN_STOCK_V')
@ObjectType()
export class ImsInvPartInStockView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @Column({ name: 'WAREHOUSE_ID' })
  warehouseId!: string;

  @Field()
  @Column({ name: 'BAY_ID' })
  bayId!: string;

  @Field()
  @Column({ name: 'ROW_ID' })
  rowId!: string;

  @Field()
  @Column({ name: 'TIER_ID' })
  tierId!: string;

  @Field()
  @Column({ name: 'BIN_ID' })
  binId!: string;

  @Field()
  @Column({ name: 'QTY_ONHAND' })
  qtyOnhand!: number;

  @Field()
  @Column({ name: 'UNIT_MEAS' })
  unitMeas!: string;

  @Field({ nullable: true })
  @Column({ name: 'CATCH_QTY_ONHAND' })
  catchQtyOnhand?: number;

  @Field({ nullable: true })
  @Column({ name: 'CATCH_UNIT_MEAS' })
  catchUnitMeas?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field()
  @Column({ name: 'CREATED_DATE' })
  createdDate!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'AGE' })
  age!: number;

  @Field()
  @Column({ name: 'MODIFIED_DATE' })
  modifiedDate!: Date;

  @Field()
  @Column({ name: 'MODIFIED_BY' })
  modifiedBy!: string;

  @Field()
  @Column({ name: 'LAST_TRANS_CODE' })
  lastTransCode!: string;

  @Field()
  @Column({ name: 'IS_DELETED' })
  isDeleted!: number;
}
