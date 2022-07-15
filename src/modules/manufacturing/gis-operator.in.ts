import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GisOperator } from './entities/gis-operator';

@InputType()
export class GisOperatorInput implements Partial<GisOperator> {
  @Field()
  @IsNumber()
  inspectId!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @MaxLength(10)
  employeeId!: string;

  @Field()
  @IsNumber()
  startingMeter!: number;

  @Field()
  @IsNumber()
  finalMeter!: number;

  @Field({ nullable: true })
  defectId?: string;
}
