import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { InvoicePayment } from './entities/bi-invoice-payment';

@InputType()
export class InvoicePaymentInput implements Partial<InvoicePayment> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  payment?: string;

  @Field({ nullable: true })
  invoiceNo?: string;

  @Field({ nullable: true })
  proformaInvoiceNo?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  paymentAmount?: number;

  @Field({ nullable: true })
  lastShipmentDate?: Date;

  @Field({ nullable: true })
  etd?: string;

  @Field({ nullable: true })
  blDate?: Date;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  paidDate?: Date;

  @Field({ nullable: true })
  paidBy?: string;

  @Field({ nullable: true })
  note?: string;

  @Field()
  imptId!: number;
}
