import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GisMeter } from './entities/gbr-gis-meter';

@InputType()
export class GisMeterInput implements Partial<GisMeter> {
  @Field()
  @IsNumber()
  inspectId!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field({ nullable: true })
  @IsNumber()
  startingMeter?: number;

  @Field({ nullable: true })
  @IsNumber()
  finalMeter?: number;

  @Field({ nullable: true })
  @MaxLength(20)
  defectId?: string;

  @Field({ nullable: true })
  @MaxLength(20)
  position?: string;

  @Field({ nullable: true })
  @MaxLength(100)
  notes?: string;
}
