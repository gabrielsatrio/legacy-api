import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_IMPT_NOTUL')
@ObjectType()
export class Notul extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'AJU_NO' })
  ajuNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PAID_DATE' })
  paidDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_AMOUNT_PIB' })
  totalAmountPib?: number;

  @Field({ nullable: true })
  @Column({ name: 'INVOICE_NO' })
  invoiceNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'AMOUNT_INV_IMPORT' })
  amountInvImport?: number;

  @Field({ nullable: true })
  @Column({ name: 'PAID_BY' })
  paidBy?: string;

  @Field()
  @Column({ name: 'IMPT_ID' })
  imptId!: number;

  @Field({ nullable: true })
  @Column({ name: 'CATEGORY' })
  category?: string;

  @Field({ nullable: true })
  @Column({ name: 'SHIPMENT' })
  shipment?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;
}
