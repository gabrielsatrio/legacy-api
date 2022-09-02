import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Notul } from './entities/bi-notul';

@InputType()
export class NotulInput implements Partial<Notul> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  ajuNo?: string;

  @Field({ nullable: true })
  paidDate?: Date;

  @Field({ nullable: true })
  totalAmountPib?: number;

  @Field({ nullable: true })
  invoiceNo?: string;

  @Field({ nullable: true })
  amountInvImport?: number;

  @Field({ nullable: true })
  paidBy?: string;

  @Field()
  imptId!: number;
}
