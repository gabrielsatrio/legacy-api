import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MessCostFixRate } from './entities/mess-cost-fr';

@InputType()
export class MessCostInput implements Partial<MessCostFixRate> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @MaxLength(20)
  mess!: string;

  @Field()
  @IsDate()
  validFrom!: Date;

  @Field()
  @IsDate()
  validTo!: Date;

  @Field()
  @IsNumber()
  subsidiTdl!: number;

  @Field()
  @IsNumber()
  subsidiBeaBeban!: number;

  @Field()
  @IsNumber()
  subsidiBeaAdm!: number;

  @Field()
  @IsNumber()
  tamuPerusahaan!: number;

  @Field()
  @IsNumber()
  tamuPribadi!: number;

  @Field()
  @IsNumber()
  biayaInternet!: number;

  @Field()
  @MaxLength(5)
  createdBy!: string;
}
