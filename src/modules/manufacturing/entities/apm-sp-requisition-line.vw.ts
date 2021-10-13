import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_SPAREPART_REQ_LINE_V')
@ObjectType()
export class SparePartReqLineView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQUISITION_ID' })
  requisitionId!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_ITEM_NO' })
  lineItemNo!: number;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'PART_DESC' })
  partDesc!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'CONDITION_CODE' })
  conditionCode?: string;

  @Field({ nullable: true })
  @Column({ name: 'CONDITION_CODE_DESC' })
  conditionCodeDesc?: string;

  @Field()
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

  @Field()
  @Column({ name: 'ORDER_CLASS_DESC' })
  orderClassDesc!: string;

  @Field({ defaultValue: 'IO' })
  @Column({ name: 'SUPPLY_CODE' })
  supplyCode!: string;

  @Field()
  @Column({ name: 'SUPPLY_CODE_DESC' })
  supplyCodeDesc!: string;

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

  @Field()
  @Column({ name: 'OBJ_ID' })
  ObjId!: string;
}
