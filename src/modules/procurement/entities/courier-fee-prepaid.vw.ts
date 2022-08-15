import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_COURIER_FEE_PREPAID_V')
@ObjectType()
export class CourierFeePrepaidView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DIVISION' })
  division!: string;

  @Field({ nullable: true })
  @Column({ name: 'SALESMAN_CODE' })
  salesmanCode?: string;

  @Field({ nullable: true })
  @Column({ name: 'PO_NUMBER' })
  poNumber?: string;

  @Field({ nullable: true })
  @Column({ name: 'CURRENCY' })
  currency?: string;

  @Field({ nullable: true })
  @Column({ name: 'DELIVERY_NOMINAL' })
  deliveryNominal?: number;

  @Field()
  @Column({ name: 'CIRCULATION_DATE' })
  circulationDate!: Date;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field({ nullable: true })
  @Column({ name: 'PAYMENT_METHOD' })
  paymentMethod?: string;

  @Field({ nullable: true })
  @Column({ name: 'AR_PERSONNEL' })
  arPersonnel?: string;

  @Field()
  @Column({ name: 'COURIER_SERVICE_NAME' })
  courierServiceName!: string;

  @Field()
  @Column({ name: 'AWB_NO' })
  awbNo!: string;

  @Field()
  @Column({ name: 'TYPE' })
  type!: string;

  @Field()
  @Column({ name: 'SENDER' })
  sender!: string;

  @Field()
  @Column({ name: 'DELIVERY_DATE' })
  deliveryDate!: Date;

  @Field()
  @Column({ name: 'RECEIVER' })
  receiver!: string;

  @Field({ nullable: true })
  @Column({ name: 'INVOICE_NO_HD' })
  invoiceNoHd?: string;

  @Field({ nullable: true })
  @Column({ name: 'COURIER_FEE' })
  courierFee?: number;

  @Field({ nullable: true })
  @Column({ name: 'INVOICE_NO_AR' })
  invoiceNoAr?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field({ nullable: true })
  @Column({ name: 'EMAIL_USER' })
  emailUser?: string;
}
