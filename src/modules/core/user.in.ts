import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { User } from './entities/user';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  username!: string;

  @Field()
  @MinLength(6, {
    message: 'Password must be at least 6 characters.'
  })
  @MaxLength(30)
  password!: string;

  @Field()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;
}
