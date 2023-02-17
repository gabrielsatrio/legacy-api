import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { PicBank } from './entities/kasbon-pic-bank';

@InputType()
export class PicBankInput implements Partial<PicBank> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  username!: string;

  @Field()
  contract!: string;
}
