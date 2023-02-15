import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { AslLog } from './entities/asl-log';

@InputType()
export class AslLogInput implements Partial<AslLog> {
  @Field()
  @IsNumber()
  aslId!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @MaxLength(1000)
  description!: string;
}
