import { Field, InputType } from 'type-graphql';
import { PicBank } from './entities/kasbon-pic-bank';

@InputType()
export class PicBankInput implements Partial<PicBank> {
  @Field()
  contract!: string;

  @Field()
  username!: string;

  @Field()
  name!: string;
}
