import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Asl } from './entities/asl';

@InputType()
export class AslInput implements Partial<Asl> {
  @Field()
  @IsNumber()
  aslId!: number;

  @Field()
  @MaxLength(100)
  name!: string;

  @Field()
  @MaxLength(100)
  category!: string;

  @Field()
  @MaxLength(100)
  platform!: string;

  @Field()
  @MaxLength(10)
  status!: string;

  @Field()
  @MaxLength(2000)
  description!: string;

  @Field()
  @MaxLength(100)
  filename!: string;

  @Field()
  @MaxLength(5)
  tier!: string;

  @Field()
  @IsNumber()
  parentId!: number;
}
