import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { SparePartRequisition } from './apm-sp-requisition';

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

  @Field()
  @Column({ name: 'REMAINING_DESC' })
  remainingDesc!: string;

  @Field()
  @Column({ name: 'REMAINING_QTY' })
  remainingQty!: number;

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

  @Field(() => SparePartRequisition)
  @ManyToOne(
    () => SparePartRequisition,
    (requisition) => requisition.requisitionLines
  )
  @JoinColumn({ name: 'REQUISITION_ID', referencedColumnName: 'requisitionId' })
  requisition!: SparePartRequisition;
}
