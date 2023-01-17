import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ExpeditionPaidDate } from './entities/expedition-paid-date';

@InputType()
export class ExpeditionPaidDateInput implements Partial<ExpeditionPaidDate> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  @IsDate()
  circulationDate?: Date;

  @Field({ nullable: true })
  expeditionName?: string;

  @Field({ nullable: true })
  invoiceNo?: string;

  @Field({ nullable: true })
  poNumber?: string;

  @Field({ nullable: true })
  ajuNo?: string;

  @Field({ nullable: true })
  totalInvoice?: number;

  @Field({ nullable: true })
  @IsDate()
  paidDate?: Date;

  @Field({ defaultValue: false })
  isPaid?: boolean;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  plant?: string;

  @Field({ nullable: true })
  paidBy?: string;

  @Field({ nullable: true })
  notesHeader?: string;

  @Field({ nullable: true })
  buktiTransfer?: string;
}
