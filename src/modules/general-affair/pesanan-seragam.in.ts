import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PesananSeragam } from './entities/pesanan-seragam';

@InputType()
export class PesananSeragamInput implements Partial<PesananSeragam> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @IsString()
  nrp!: string;

  @Field()
  @IsNumber()
  idJenis!: number;

  @Field()
  @MaxLength(10)
  ukuranKemeja!: string;

  @Field()
  @MaxLength(10)
  ukuranCelana!: string;

  @Field()
  @IsNumber()
  jumlahKemeja!: number;

  @Field()
  @IsNumber()
  jumlahCelana!: number;

  @Field({ nullable: true })
  @MaxLength(100)
  keterangan?: string;

  @Field()
  @MaxLength(4)
  tahun!: string;

  @Field()
  @IsNumber()
  periode!: number;

  @Field()
  @IsBoolean()
  isLocked!: boolean;
}
