import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_IMPORT_EXPEDITION')
@ObjectType()
export class ImportExpedition extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'PLANT' })
  plant?: string;

  @Field({ nullable: true })
  @Column({ name: 'PO_NUMBER' })
  poNumber?: string;

  @Field({ nullable: true })
  @Column({ name: 'CIRCULATION_DATE' })
  circulationDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'EXPEDITION_NAME' })
  expeditionName?: string;

  @Field({ nullable: true })
  @Column({ name: 'DELIVERY_NOMINAL' })
  deliveryNominal?: number;

  @Field({ nullable: true })
  @Column({ name: 'INVOICE_NO' })
  invoiceNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'AJU_NO' })
  ajuNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'CURRENCY' })
  currency?: string;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_INVOICE' })
  totalInvoice?: number;

  @Field({ nullable: true })
  @Column({ name: 'SUPPLIER' })
  supplier?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field({ nullable: true })
  @Column({ name: 'FINANCE_RECEIPT_DATE' })
  financeReceiptDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'DPP' })
  dpp?: number;

  @Field({ nullable: true })
  @Column({ name: 'PPN' })
  ppn?: number;

  @Field({ nullable: true })
  @Column({ name: 'PERIODE_BAYAR' })
  periodeBayar?: string;

  @Field({ nullable: true })
  @Column({ name: 'CREATED_BY' })
  createdBy?: string;

  @Field({ nullable: true })
  @Column({ name: 'EMAIL_USER' })
  emailUser?: string;
}
