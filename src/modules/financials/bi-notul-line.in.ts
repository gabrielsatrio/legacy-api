import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { NotulLine } from './entities/bi-notul-line';

@InputType()
export class NotulLineInput implements Partial<NotulLine> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  pibItems?: string;

  @Field({ nullable: true })
  amountIdr?: number;

  @Field()
  notulId!: number;
}
