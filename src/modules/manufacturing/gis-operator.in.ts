import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GisOperator } from './entities/gbr-gis-operator';

@InputType()
export class GisOperatorInput implements Partial<GisOperator> {
  @Field()
  @IsNumber()
  inspectId!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field({ nullable: true })
  @MaxLength(10)
  operatorId?: string;

  @Field({ nullable: true })
  @IsNumber()
  startingMeter?: number;

  @Field({ nullable: true })
  @IsNumber()
  finalMeter?: number;
}
