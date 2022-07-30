import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_EXPEDITION_PAID_DATE')
@ObjectType()
export class ExpeditionPaidDate extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'CIRCULATION_DATE' })
  circulationDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'EXPEDITION_NAME' })
  expeditionName?: string;

  @Field({ nullable: true })
  @Column({ name: 'INVOICE_NO' })
  invoiceNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PO_NUMBER' })
  poNumber?: string;

  @Field({ nullable: true })
  @Column({ name: 'AJU_NO' })
  ajuNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_INVOICE' })
  totalInvoice?: number;

  @Field({ nullable: true })
  @Column({ name: 'PAID_DATE' })
  paidDate?: Date;

  @Field({ defaultValue: false })
  @Column({ name: 'IS_PAID' })
  isPaid?: boolean;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field({ nullable: true })
  @Column({ name: 'PLANT' })
  plant?: string;
}
