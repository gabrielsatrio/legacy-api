import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('MATERIAL_REQUISITION')
@ObjectType()
export class IfsMaterialRequisitionView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'ORDER_CLASS_DB' })
  orderClassDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'ORDER_CLASS' })
  orderClass?: string;

  @Field()
  @Column({ name: 'INT_CUSTOMER_NO' })
  intCustomerNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'WBS' })
  wbs?: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'PRE_ACCOUNTING_ID' })
  preAccountingId!: number;

  @Field()
  @Column({ name: 'NOTE_ID' })
  noteId!: number;

  @Field({ nullable: true })
  @Column({ name: 'STATUS_CODE' })
  statusCode?: string;

  @Field()
  @Column({ name: 'STATUS_CODE_DB' })
  statusCodeDb!: string;

  @Field()
  @Column({ name: 'DATE_ENTERED' })
  dateEntered!: Date;

  @Field()
  @Column({ name: 'DUE_DATE' })
  dueDate!: Date;

  @Field({ nullable: true })
  @Column({ name: 'NOTE_TEXT' })
  noteText?: string;

  @Field({ nullable: true })
  @Column({ name: 'INTERNAL_DESTINATION' })
  internalDestination?: string;

  @Field({ nullable: true })
  @Column({ name: 'DESTINATION_ID' })
  destinationId?: string;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_VALUE' })
  totalValue?: number;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;

  @Field()
  @Column({ name: 'OBJVERSION' })
  objVersion!: string;

  @Field()
  @Column({ name: 'OBJKEY' })
  objKey!: string;
}
