import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { BonMakanWeekdaysDetail } from './entities/bon-makan-wdays-detail';

@InputType()
export class BonMakanWeekdaysDetailInput
  implements Partial<BonMakanWeekdaysDetail>
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
  grade!: string;

  @Field({ nullable: true })
  @IsNumber()
  sgRoti12?: number;

  @Field({ nullable: true })
  @IsNumber()
  pgRotiBesar?: number;

  @Field({ nullable: true })
  @IsNumber()
  pgRotiKecil?: number;

  @Field({ nullable: true })
  @IsNumber()
  sgNasi?: number;

  @Field({ nullable: true })
  @IsNumber()
  sgRotiBesar?: number;

  @Field({ nullable: true })
  @IsNumber()
  sgRotiKecil?: number;

  @Field({ nullable: true })
  @IsNumber()
  mlNasi?: number;

  @Field({ nullable: true })
  @IsNumber()
  mlRotiBesar?: number;

  @Field({ nullable: true })
  @IsNumber()
  mlRotiKecil?: number;

  @Field({ nullable: true })
  @IsNumber()
  mlRoti12?: number;

  @Field(() => Int)
  @IsNumber()
  bonMakanWdaysId!: number;
}
