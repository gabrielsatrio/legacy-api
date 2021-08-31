import { Field, InputType } from 'type-graphql';
import { Customer } from './entities/spt-customer';

@InputType()
export class CustomerInput implements Partial<Customer> {
  @Field()
  customerId!: string;

  @Field()
  customerName!: string;

  @Field()
  address?: string;

  @Field({ nullable: true })
  phone?: string;
}
