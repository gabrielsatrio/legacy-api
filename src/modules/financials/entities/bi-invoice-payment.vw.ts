import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_IMPT_INVOICE_PAYMENT_V')
@ObjectType()
export class InvoicePaymentView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'PAYMENT' })
  payment?: string;

  @Field({ nullable: true })
  @Column({ name: 'INVOICE_NO' })
  invoiceNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PROFORMA_INVOICE_NO' })
  proformaInvoiceNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'CURRENCY' })
  currency?: string;

  @Field({ nullable: true })
  @Column({ name: 'PAYMENT_AMOUNT' })
  paymentAmount?: number;

  @Field({ nullable: true })
  @Column({ name: 'LAST_SHIPMENT_DATE' })
  lastShipmentDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'ETD' })
  etd?: Date;

  @Field({ nullable: true })
  @Column({ name: 'BL_DATE' })
  blDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'DUE_DATE' })
  dueDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'PAID_DATE' })
  paidDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'PAID_BY' })
  paidBy?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field({ nullable: true })
  @Column({ name: 'VOUCHER_TEXT' })
  voucherText?: string;

  @Field({ nullable: true })
  @Column({ name: 'SHIP' })
  ship?: string;

  @Field()
  @Column({ name: 'IMPT_ID' })
  imptId!: number;
}
