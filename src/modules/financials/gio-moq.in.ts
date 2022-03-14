import { IsNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Moq } from './entities/gio-moq';

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

  @Field()
  gabungCO?: string;
}
