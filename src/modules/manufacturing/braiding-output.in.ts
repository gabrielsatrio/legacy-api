import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { EffBraiding } from './entities/braiding-output';

@InputType()
export class EffBraidingInput implements Partial<EffBraiding> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @IsNumber()
  quantity!: number;

  @Field()
  @IsDate()
  tgl!: Date;
}
