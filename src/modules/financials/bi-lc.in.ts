import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Lc } from './entities/bi-lc';

@InputType()
export class LcInput implements Partial<Lc> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  lcCharges?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  amount?: number;

  @Field({ nullable: true })
  paidDate?: Date;

  @Field({ nullable: true })
  paidBy?: string;

  @Field()
  imptId!: number;
}
