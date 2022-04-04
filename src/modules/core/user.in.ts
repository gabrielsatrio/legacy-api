import { Length, MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { User } from './entities/user';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  @Length(5)
  username!: string;

  @Field()
  @MinLength(6, {
    message: 'Password must be at least 6 characters.'
  })
  @MaxLength(30)
  password!: string;

  @Field()
  @Length(3)
  departmentId!: string;

  @Field()
  usernameDb!: 'AT' | 'AG';

  @Field()
  @MinLength(5)
  @MaxLength(8)
  ifsUsername!: string;
}
