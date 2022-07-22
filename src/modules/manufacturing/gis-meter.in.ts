import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GisMeter } from './entities/gis-meter';

@InputType()
export class GisMeterInput implements Partial<GisMeter> {
  @Field()
  @IsNumber()
  inspectId!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @IsNumber()
  startingMeter!: number;

  @Field()
  @IsNumber()
  finalMeter!: number;

  @Field()
  @MaxLength(20)
  defectId!: string;

  @Field()
  @MaxLength(20)
  position!: string;

  @Field({ nullable: true })
  @MaxLength(100)
  notes?: string;
}
