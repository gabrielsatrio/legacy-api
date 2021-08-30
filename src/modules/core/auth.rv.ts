import config from '@/config/main';
import { redis } from '@/providers/redis';
import { sendEmail } from '@/utils/send-email';
import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import { Context } from 'vm';
import { User } from './entities/user';
import { LoginInput } from './login.in';
import { RegisterInput } from './register.in';

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

  @Mutation(() => User)
  async register(
    @Arg('input', { validate: true }) input: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<User | undefined> {
    let user;
    try {
      const hashedPassword = await argon2.hash(input.password);
      user = await User.create({ ...input, password: hashedPassword }).save();
    } catch (err) {
      throw new Error(err.message);
    }
    req.session.userId = user.id;
    req.session.defaultSite = user.defaultSite;
    return user;
  }

  @Mutation(() => User)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() { req }: Context
  ): Promise<User | undefined> {
    let user;
    try {
      user = await User.findOne({ username: input.username });
      if (!user) {
        throw new Error('Invalid username.');
      }
      const valid = await argon2.verify(user.password, input.password);
      if (!valid) {
        throw new Error('Invalid password.');
      }
      req.session.userId = user.id;
      req.session.defaultSite = user.defaultSite;
    } catch (err) {
      throw new Error(err.message);
    }
    return user;
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
    return true;
  }

  @Mutation(() => User)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { req }: Context
  ): Promise<User> {
    const tokenKey = `${FORGET_PASSWORD_PREFIX}${token}`;
    if (newPassword.length < 3) {
      throw new Error('Password must be longer than or equal to 3 characters.');
    }
    const userId = +redis.get(tokenKey);
    if (!userId) {
      throw new Error('Token expired.');
    }
    const user = await User.findOne(userId);
    if (!user) {
      throw new Error('User no longer exists.');
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
    return user;
  }
}
