import { Field, InputType } from 'type-graphql';
import { BankAccount } from './entities/bank-account';

@InputType()
export class BankAccountInput implements Partial<BankAccount> {
  @Field()
  accountNo!: string;

  @Field()
  accountDescription!: string;
}
