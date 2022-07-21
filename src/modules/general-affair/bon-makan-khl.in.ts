import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { BonMakanKhl } from './entities/bon-makan-khl';

@InputType()
export class BonMakanKhlInput implements Partial<BonMakanKhl> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  @IsDate()
  tanggal!: Date;

  @Field()
  grade!: string;

  @Field()
  keterangan!: string;
}
