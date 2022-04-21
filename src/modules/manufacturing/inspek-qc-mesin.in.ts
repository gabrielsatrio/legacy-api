import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { InspekQcMesin } from './entities/inspek-qc-mesin';

@InputType()
export class InspekQcMesinInput implements Partial<InspekQcMesin> {
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
  tnShift1!: number;

  @Field()
  @IsNumber()
  tnShift2!: number;

  @Field()
  @IsNumber()
  tnShift3!: number;

  @Field()
  @IsNumber()
  rjShift1!: number;

  @Field()
  @IsNumber()
  rjShift2!: number;

  @Field()
  @IsNumber()
  rjShift3!: number;

  @Field({ nullable: true })
  @MaxLength(200)
  keterangan?: string;
}
