import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { AfalBraiding } from './entities/afal-braiding';

@InputType()
export class AfalBraidingInput implements Partial<AfalBraiding> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @IsDate()
  tanggal!: Date;

  @Field()
  @IsNumber()
  pp!: number;

  @Field()
  @IsNumber()
  polyester!: number;

  @Field()
  @IsNumber()
  pvc!: number;
}
