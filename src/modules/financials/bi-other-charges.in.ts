import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { OtherCharges } from './entities/bi-other-charges';

@InputType()
export class OtherChargesInput implements Partial<OtherCharges> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  invoiceNo?: string;

  @Field({ nullable: true })
  ajuNo?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  amount?: number;

  @Field({ nullable: true })
  paidDate?: Date;

  @Field({ nullable: true })
  paidBy?: string;

  @Field({ nullable: true })
  shipCurrency?: string;

  @Field({ nullable: true })
  shipAmount?: number;

  @Field({ nullable: true })
  shipNote?: string;

  @Field()
  imptId!: number;
}
