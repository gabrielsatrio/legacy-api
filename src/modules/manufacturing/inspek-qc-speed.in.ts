import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { InspekQcSpeed } from './entities/inspek-qc-speed';

@InputType()
export class InspekQcSpeedInput implements Partial<InspekQcSpeed> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @IsDate()
  tgl!: Date;

  @Field()
  @IsNumber()
  realSpeedTn!: number;

  @Field()
  @IsNumber()
  realSpeedRj!: number;

  @Field({ nullable: true })
  @MaxLength(200)
  keterangan?: string;
}
