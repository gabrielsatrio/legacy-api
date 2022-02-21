import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { InspekQc } from './entities/inspek-qc';

@InputType()
export class InspekQcInput implements Partial<InspekQc> {
  @Field()
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  @IsDate()
  tgl?: Date;

  @Field({ nullable: true })
  @IsNumber()
  shift1?: number;

  @Field({ nullable: true })
  @IsNumber()
  shift2?: number;

  @Field({ nullable: true })
  @IsNumber()
  shift3?: number;

  @Field({ nullable: true })
  @IsNumber()
  realisasi?: number;

  @Field({ nullable: true })
  @MaxLength(200)
  keterangan?: string;
  @Field({ nullable: true })
  @IsDate()
  createdAt?: Date;
}
