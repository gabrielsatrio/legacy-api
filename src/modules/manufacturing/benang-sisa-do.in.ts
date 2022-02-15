import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { BenangSisaDo } from './entities/benang-sisa-do';

@InputType()
export class BenangSisaDoInput implements Partial<BenangSisaDo> {
  @Field({ nullable: true })
  @MaxLength(5)
  contract?: string;

  @Field({ nullable: true })
  @IsDate()
  tanggal?: Date;

  @Field()
  @IsNumber()
  totalDo!: number;

  @Field({ nullable: true })
  @MaxLength(250)
  keterangan?: string;

  @Field({ nullable: true })
  @MaxLength(100)
  rowId?: string;
}
