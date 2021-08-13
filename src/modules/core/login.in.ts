import { Field, InputType } from 'type-graphql';
import { User } from './entities/user';

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  username!: string;

  @Field()
  password!: string;
}
