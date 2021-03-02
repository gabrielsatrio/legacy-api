import argon2 from 'argon2';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import { Context } from 'vm';
import { User } from '../../entities/User';
import { redis } from '../../redis';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { sendEmail } from '../../utils/sendEmail';
import { setErrors } from '../../utils/setErrors';
import { LoginInput } from './types/LoginInput';
import { RegisterInput } from './types/RegisterInput';

const FORGET_PASSWORD_PREFIX = process.env.FORGET_PASSWORD_PREFIX;

@ObjectType()
class FieldError {
  @Field()
  field!: string;

  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class AuthResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | undefined> {
    if (!req.session.userId) {
      return undefined;
    }
    return await User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('input', { validate: true }) input: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse | undefined> {
    let user;

    try {
      const hashedPassword = await argon2.hash(input.password);

      user = await User.create({ ...input, password: hashedPassword }).save();
    } catch (err) {
      if (err.code === '23505') {
        const regExp = /\(([^)]+)\)/;
        const field = regExp.exec(err.detail)?.[1];
        if (typeof field !== 'undefined') {
          return setErrors(
            field,
            `${capitalizeFirstLetter(field)} already exists`
          );
        }
      }

      return setErrors('general', err.message);
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse | undefined> {
    let user;

    try {
      user = await User.findOne({ username: input.username });

      if (!user) {
        return setErrors('username', `Username doesn't exists`);
      }

      const valid = await argon2.verify(user.password, input.password);

      if (!valid) {
        return setErrors('password', 'Incorrect password');
      }

      req.session.userId = user.id;
    } catch (err) {
      return setErrors('general', err.message);
    }

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err: unknown) => {
        const cookieName = process.env.COOKIE_NAME;
        if (cookieName) {
          res.clearCookie(cookieName, {
            domain: process.env.COOKIE_DOMAIN,
            path: '/'
          });
        }
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ email });

    if (!user) {
      return true;
    }

    const token = uuidv4();

    await redis.set(
      `${FORGET_PASSWORD_PREFIX}${token}`,
      user.id,
      'ex',
      1000 * 60 * 60 * 24
    ); // 1 day expiration

    await sendEmail(
      email,
      `<a href="${process.env.FRONTEND_URL}}/change-password/${token}">Reset Password</a>`
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    const tokenKey = `${FORGET_PASSWORD_PREFIX}${token}`;

    if (newPassword.length < 3) {
      return setErrors(
        'newPassword',
        'Password must be longer than or equal to 3 characters'
      );
    }

    const userId = +redis.get(tokenKey);

    if (!userId) {
      return setErrors('newPassword', 'Token expired');
    }

    const user = await User.findOne(userId);

    if (!user) {
      return setErrors('newPassword', 'User no longer exists');
    }

    await User.update(
      { id: userId },
      {
        password: await argon2.hash(newPassword)
      }
    );

    await redis.del(tokenKey);
    req.session.userId = user.id;

    return { user };
  }
}
