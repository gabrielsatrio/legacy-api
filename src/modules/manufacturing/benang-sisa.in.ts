import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { BenangSisa } from './entities/benang-sisa';

@InputType()
export class BenangSisaInput implements Partial<BenangSisa> {
  @Field()
  @MaxLength(5)
  contract?: string;

  @Field()
  @IsDate()
  tanggal?: Date;

  @Field()
  @MaxLength(5)
  noPalet?: string;

  @Field()
  @IsNumber()
  noDus?: number;

  @Field()
  @MaxLength(50)
  jenisBarang!: string;

  @Field({ nullable: true })
  @MaxLength(50)
  denier?: string;

  @Field()
  @IsNumber()
  jumlahBobin!: number;

  @Field({ nullable: true })
  @MaxLength(50)
  lot?: string;

  @Field()
  @IsNumber()
  brutto!: number;

  @Field()
  @IsNumber()
  tara!: number;

  @Field()
  @IsNumber()
  netto!: number;

  @Field({ nullable: true })
  @MaxLength(200)
  keterangan?: string;

  @Field()
  @MaxLength(20)
  department!: string;
}
