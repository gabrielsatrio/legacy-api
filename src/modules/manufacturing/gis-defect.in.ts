import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GisDefect } from './entities/gis-defect';

@InputType()
export class GisDefectInput implements Partial<GisDefect> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(10)
  defectId!: string;

  @Field()
  @MaxLength(500)
  defectDescription!: string;
}
