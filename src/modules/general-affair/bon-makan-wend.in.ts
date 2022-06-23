import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { BonMakanWeekend } from './entities/bon-makan-wend';

@InputType()
export class BonMakanWeekendInput implements Partial<BonMakanWeekend> {
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
  createdBy!: string;
}
