import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PengirimanKain } from './entities/pengiriman-kain';

@InputType()
export class PengirimanKainInput implements Partial<PengirimanKain> {
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
  @MaxLength(1)
  shift!: string;

  @Field()
  @MaxLength(50)
  lotBatchNo!: string;

  @Field()
  @MaxLength(20)
  category!: string;

  @Field()
  @MaxLength(200)
  partNo!: string;

  @Field()
  @MaxLength(50)
  jobOrder!: string;

  @Field()
  @IsNumber()
  qtyKp!: number;

  @Field()
  @IsNumber()
  qtyReal!: number;
}
