import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_SPAREPART_REQ_LINE')
@ObjectType()
export class SparePartReqLine extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'REQUISITION_ID' })
  requisitionId!: number;

  @Field(() => Int)
  @PrimaryColumn({ name: 'LINE_ITEM_NO' })
  lineItemNo!: number;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'CONDITION_CODE' })
  conditionCode?: string;

  @Field({ defaultValue: 0 })
  @Column({ name: 'QTY_DUE' })
  qtyDue!: number;

  @Field()
  @Column({ name: 'UNIT_MEAS' })
  unitMeas!: string;

  @Field({ defaultValue: false })
  @Column({ name: 'PROJECT' })
  project!: boolean;

  @Field({ defaultValue: 'INT' })
  @Column({ name: 'ORDER_CLASS' })
  orderClass!: string;

  @Field({ defaultValue: 'IO' })
  @Column({ name: 'SUPPLY_CODE' })
  supplyCode!: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field({ defaultValue: false })
  @Column({ name: 'ASSIGNED' })
  assigned!: boolean;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
