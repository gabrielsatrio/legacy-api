import { Field, InputType } from 'type-graphql';
import { User } from '../../../entities/User';

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  username!: string;

  @Field()
  password!: string;
}
