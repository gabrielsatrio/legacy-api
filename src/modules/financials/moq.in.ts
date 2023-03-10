import { IsNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Moq } from './entities/moq';

@InputType()
export class MoqInput implements Partial<Moq> {
  @Field()
  orderNo!: string;

  @Field()
  lineNo!: string;

  @Field()
  relNo!: string;

  @Field()
  @IsNumber()
  minQty!: number;

  @Field({ nullable: true })
  gabungCo?: string;
}
