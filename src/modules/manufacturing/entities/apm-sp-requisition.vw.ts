import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_SPAREPART_REQ_V')
@ObjectType()
export class SparePartRequisitionView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQUISITION_ID' })
  requisitionId!: string;

  @Field({ nullable: true })
  @Column({ name: 'ORDER_NO' })
  orderNo?: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ defaultValue: 'INT' })
  @Column({ name: 'ORDER_CLASS' })
  orderClass!: string;

  @Field()
  @Column({ name: 'ORDER_CLASS_DESC' })
  orderClassDesc!: string;

  @Field()
  @Column({ name: 'INT_CUSTOMER_NO' })
  intCustomerNo!: string;

  @Field()
  @Column({ name: 'INT_CUSTOMER' })
  intCustomer!: string;

  @Field({ nullable: true })
  @Column({ name: 'DESTINATION_ID' })
  destinationId?: string;

  @Field({ nullable: true })
  @Column({ name: 'INT_DESTINATION' })
  intDestination?: string;

  @Field()
  @Column({ name: 'DUE_DATE' })
  dueDate!: Date;

  @Field({ defaultValue: false })
  @Column({ name: 'URGENT' })
  urgent!: boolean;

  @Field()
  @Column({ name: 'APPROVER_LV_1' })
  approverLv1!: string;

  @Field()
  @Column({ name: 'EMAIL_APPR_LV_1' })
  emaillApprLv1!: string;

  @Field()
  @Column({ name: 'APPROVER_LV_2' })
  approverLv2!: string;

  @Field()
  @Column({ name: 'EMAIL_APPR_LV_2' })
  emaillApprLv2!: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;
}
