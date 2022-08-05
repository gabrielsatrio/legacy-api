import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { PaidDate } from './entities/paid-date';

@InputType()
export class PaidDateInput implements Partial<PaidDate> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  @IsDate()
  fromCirculationDate!: Date;

  @Field()
  @IsDate()
  untilCirculationDate!: Date;

  @Field()
  @IsDate()
  paidDate!: Date;
}
