import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { AslSource } from './entities/asl-source';

@InputType()
export class AslSourceInput implements Partial<AslSource> {
  @Field()
  @IsNumber()
  aslId!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @MaxLength(100)
  platform!: string;

  @Field()
  @MaxLength(100)
  category!: string;

  @Field()
  @IsNumber()
  sourceId!: number;

  @Field()
  @MaxLength(1000)
  description!: string;
}
