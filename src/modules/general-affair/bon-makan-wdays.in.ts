import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { BonMakanWeekdays } from './entities/bon-makan-wdays';

@InputType()
export class BonMakanWeekdaysInput implements Partial<BonMakanWeekdays> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  dept!: string;

  @Field()
  plant!: string;

  @Field()
  @IsDate()
  fromTanggal!: Date;

  @Field()
  @IsDate()
  toTanggal!: Date;

  @Field()
  createdBy!: string;
}
