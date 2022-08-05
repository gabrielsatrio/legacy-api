import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { BonMakanKhlDetail } from './entities/bon-makan-khl-detail';

@InputType()
export class BonMakanKhlDetailInput implements Partial<BonMakanKhlDetail> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  nrp!: string;

  @Field()
  nama!: string;

  @Field(() => Int)
  @IsNumber()
  bonMakanKhlId!: number;
}
