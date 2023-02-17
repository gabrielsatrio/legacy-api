import { Field, InputType } from 'type-graphql';
import { BankKasbon } from './entities/kasbon-bank';

@InputType()
export class BankKasbonInput implements Partial<BankKasbon> {
  @Field()
  bank!: string;
}
