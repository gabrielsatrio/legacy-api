import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PURCHASE_REQUISITION')
@ObjectType()
export class IfsPurchaseRequisitionView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQUISITION_NO' })
  requisitionNo!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'ORDER_CODE' })
  orderCode?: string;

  @Field()
  @Column({ name: 'REQUISITIONER_CODE' })
  requisitionerCode!: string;

  @Field()
  @Column({ name: 'REQUISITION_DATE' })
  requisitionDate!: Date;

  @Field({ nullable: true })
  @Column({ name: 'DESTINATION_ID' })
  destinationId?: string;

  @Field({ nullable: true })
  @Column({ name: 'INTERNAL_DESTINATION' })
  internalDestination?: string;

  @Field({ nullable: true })
  @Column({ name: 'STATE' })
  state?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_RELEASED_BY' })
  releasedBy?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_RELEASED_DATE' })
  releasedDate?: Date;

  @Field()
  @Column({ name: 'OBJKEY' })
  objKey!: string;
}
