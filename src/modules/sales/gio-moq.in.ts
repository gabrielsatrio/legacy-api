import { IsNumber, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Moq } from './entities/gio-moq';

@InputType()
export class MoqInput implements Partial<Moq> {
  @Field()
  @Length(1, 5)
  contract!: string;

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
  rowId!: string;
}
