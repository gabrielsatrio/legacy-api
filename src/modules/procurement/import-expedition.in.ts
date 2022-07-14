import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ImportExpedition } from './entities/import-expedition';

@InputType()
export class ImportExpeditionInput implements Partial<ImportExpedition> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  plant?: string;

  @Field({ nullable: true })
  poNumber?: string;

  @Field({ nullable: true })
  circulationDate?: Date;

  @Field({ nullable: true })
  expeditionName?: string;

  @Field({ nullable: true })
  deliveryNominal?: number;

  @Field({ nullable: true })
  invoiceNo?: string;

  @Field({ nullable: true })
  ajuNo?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  totalInvoice?: number;

  @Field({ nullable: true })
  supplier?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  financeReceiptDate?: Date;
}