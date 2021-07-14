import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { User } from '../../../entities/User';

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  @MinLength(3, {
    message: 'Username is too short'
  })
  username!: string;

  @Field()
  @MinLength(3, {
    message: 'First Name is too short'
  })
  firstName!: string;

  @Field()
  @MinLength(3, {
    message: 'Last Name is too short'
  })
  lastName!: string;

  @Field()
  @MinLength(3, {
    message: 'Password is too short'
  })
  password!: string;

  @Field()
  @IsEmail(
    {},
    {
      message: 'Please enter a valid email address'
    }
  )
  email!: string;

  @Field()
  role!: string;

  @Field()
  defaultSite!: string;

  @Field()
  defaultDept!: string;
}
