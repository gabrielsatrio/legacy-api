import config from '@/config/main';
import { redis } from '@/providers/redis';
import { sendEmail } from '@/utils/send-email';
import { setErrors } from '@/utils/set-errors';
import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import { Context } from 'vm';
import { User } from './entities/user';
import { LoginInput } from './login.in';
import { RegisterInput } from './register.in';
import { UserResponse } from './user.dr';

const FORGET_PASSWORD_PREFIX = config.token.prefix;

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
      return setErrors(err.message);
    }
    req.session.userId = user.id;
    req.session.defaultSite = user.defaultSite;
    return { success: true, data: user };
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
        return setErrors(`Username doesn't exists`, 'username');
      }
      const valid = await argon2.verify(user.password, input.password);
      if (!valid) {
        return setErrors('Incorrect password', 'password');
      }
      req.session.userId = user.id;
      req.session.defaultSite = user.defaultSite;
    } catch (err) {
      return setErrors(err.message);
    }
    return { success: true, data: user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err: unknown) => {
        const cookieName = config.cookie.name;
        if (cookieName) {
          res.clearCookie(cookieName, {
            domain: config.cookie.domain,
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
      `<a href="${config.client.url}}/auth/change-password/${token}">Reset Password</a>`
    );
    return true; //TODO: Replace it with DataResponse.
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
        'Password must be longer than or equal to 3 characters',
        'newPassword'
      );
    }
    const userId = +redis.get(tokenKey);
    if (!userId) {
      return setErrors('Token expired', 'newPassword');
    }
    const user = await User.findOne(userId);
    if (!user) {
      return setErrors('User no longer exists', 'newPassword');
    }
    await User.update(
      { id: userId },
      {
        password: await argon2.hash(newPassword)
      }
    );
    await redis.del(tokenKey);
    req.session.userId = user.id;
    req.session.defaultSite = user.defaultSite;
    return { success: true, data: user };
  }
}
