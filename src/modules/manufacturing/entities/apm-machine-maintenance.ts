import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_MAINTENANCE')
@ObjectType()
export class MachineMaintenance extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'MAINTENANCE_ID' })
  maintenanceId!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'MACHINE_ID' })
  machineId!: string;

  @Field()
  @Column({ name: 'MAINTENANCE_DATE' })
  maintenanceDate!: Date;

  @Field()
  @Column({ name: 'CATEGORY_ID' })
  categoryId!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field({ nullable: true })
  @Column({ name: 'QUANTITY' })
  quantity?: number;

  @Field()
  @Column({ name: 'PERFORMED_BY' })
  performedBy!: string;

  @Field()
  @Column({ name: 'PERSON_NAME' })
  personName!: string;

  @Field({ nullable: true })
  @Column({ name: 'MR_NO' })
  mrNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'MR_LINE_NO' })
  mrLineNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'MR_RELEASE_NO' })
  mrReleaseNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'MR_LINE_ITEM_NO' })
  mrLineItemNo?: number;

  @Field({ nullable: true })
  @Column({ name: 'MR_ORDER_CLASS' })
  mrOrderClass?: string;

  @Field({ nullable: true })
  @Column({ name: 'PR_NO' })
  prNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PR_LINE_NO' })
  prLineNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PR_RELEASE_NO' })
  prReleaseNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PO_NO' })
  poNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PO_LINE_NO' })
  poLineNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PO_RELEASE_NO' })
  poReleaseNo?: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
