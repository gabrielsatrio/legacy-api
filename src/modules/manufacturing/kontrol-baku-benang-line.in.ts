import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { KontrolBakuBenangLine } from './entities/kontrol-baku-benang-line';

@InputType()
export class KontrolBakuBenangLineInput
  implements Partial<KontrolBakuBenangLine>
{
  @Field()
  @IsNumber()
  idKontrol!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @MaxLength(5)
  contract!: string;

  @Field({ nullable: true })
  @MaxLength(50)
  partNo?: string;

  @Field({ nullable: true })
  @MaxLength(20)
  lotBatchNo?: string;

  @Field({ nullable: true })
  @IsNumber()
  receiptQty?: number;

  @Field({ nullable: true })
  @MaxLength(50)
  machine?: string;

  @Field({ nullable: true })
  @IsDate()
  startDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  finishDate?: Date;

  @Field({ nullable: true })
  @IsNumber()
  remainingQty?: number;
}
