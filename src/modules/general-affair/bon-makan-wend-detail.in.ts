import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { BonMakanWeekendDetail } from './entities/bon-makan-wend-detail';

@InputType()
export class BonMakanWeekendDetailInput
  implements Partial<BonMakanWeekendDetail>
{
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  dept!: string;

  @Field()
  plant!: string;

  @Field()
  @IsDate()
  tanggal!: Date;

  @Field()
  nrp!: string;

  @Field()
  nama!: string;

  @Field()
  sgRealisasi!: string;

  @Field()
  sgMakan!: string;

  @Field({ nullable: true })
  sgKeterangan?: string;

  @Field()
  mlRealisasi!: string;

  @Field()
  mlMakan!: string;

  @Field({ nullable: true })
  mlKeterangan?: string;

  @Field(() => Int)
  @IsNumber()
  bonMakanWendId!: number;
}
