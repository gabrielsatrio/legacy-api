import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_SPAREPART_REQ')
@ObjectType()
export class SparePartRequisition extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'REQUISITION_ID' })
  requisitionId!: number;

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
  @Column({ name: 'INT_CUSTOMER_NO' })
  intCustomerNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'DESTINATION_ID' })
  destinationId?: string;

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
  emailApprLv1!: string;

  @Field()
  @Column({ name: 'APPROVER_LV_2' })
  approverLv2!: string;

  @Field()
  @Column({ name: 'EMAIL_APPR_LV_2' })
  emailApprLv2!: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'EMAIL_CREATED_BY' })
  emailCreatedBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
