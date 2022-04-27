import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { BenangSisaDo } from './entities/benang-sisa-do';

@InputType()
export class BenangSisaDoInput implements Partial<BenangSisaDo> {
  @Field()
  @MaxLength(5)
  contract?: string;

  @Field()
  @IsDate()
  tanggal?: Date;

  @Field()
  @IsNumber()
  totalDo!: number;

  @Field({ nullable: true })
  @MaxLength(250)
  keterangan?: string;

  @Field()
  @MaxLength(20)
  department!: string;
}
