import config from '@/config/main';
import { ifs } from '@/database/data-sources';
import { redis } from '@/providers/redis';
import { mapError } from '@/utils/map-error';
import { sendEmail } from '@/utils/send-email';
import argon2 from 'argon2';
import oracledb from 'oracledb';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import { Context } from 'vm';
import { User } from './entities/user';
import { UserView } from './entities/user.vw';
import { LoginInput } from './login.in';

const FORGET_PASSWORD_PREFIX = config.token.prefix;

@Resolver(User)
export class AuthResolver {
  @Query(() => UserView, { nullable: true })
  async currentUser(@Ctx() { req }: Context): Promise<UserView | null> {
    try {
      const username = req.session.username;
      if (!username) {
        throw new Error('You need to login first.');
      }
      const user = await UserView.findOneBy({ username });
      if (!user || user?.status === 'Inactive') return null;
      return user;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => UserView)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserView | null> {
    try {
      const user = await UserView.findOneBy({ username: input.username });
      if (!user) {
        throw new Error('Invalid username.');
      }
      const valid = await argon2.verify(user.password, input.password);
      if (!valid) {
        throw new Error('Invalid password.');
      }
      const data = await UserView.findOneBy({ username: input.username });
      req.session.username = user.username;
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: Context): Promise<boolean> {
    try {
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
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('username') username: string): Promise<boolean> {
    try {
      const user = await User.findOneBy({ username });
      if (!user) {
        return true;
      }
      const token = uuidv4();
      await redis.set(
        `${FORGET_PASSWORD_PREFIX}${token}`,
        user.username,
        'ex' as any,
        1000 * 60 * 60 * 24
      ); // 1 day expiration
      await sendEmail(
        user.email,
        'Change Password',
        `<a href="${config.client.url}/auth/change-password/?token=${token}">Reset Password</a>`
      );
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => UserView)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { req }: Context
  ): Promise<UserView | null> {
    try {
      const tokenKey = `${FORGET_PASSWORD_PREFIX}${token}`;
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
      const username = await redis.get(tokenKey);
      if (!username) {
        throw new Error('Token expired.');
      }
      const user = await UserView.findOneBy({ username });
      if (!user) {
        throw new Error('User no longer exists.');
      }
      const hashedPassword = await argon2.hash(newPassword);
      const sql = `
        BEGIN
          ATJ_AUTH_API.Change_Password(:username,
            :newPassword,
            :outUsername);
        END;
      `;
      const result = await ifs.query(sql, [
        username,
        hashedPassword,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outUsername = result[0] as string;
      const data = UserView.findOneBy({ username: outUsername });
      await redis.del(tokenKey);
      req.session.username = outUsername;
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => UserView)
  async changeUserPassword(
    @Arg('username') username: string,
    @Arg('currentPassword', { nullable: true }) currentPassword: string,
    @Arg('newPassword') newPassword: string,
    @Arg('confirmPassword') confirmPassword: string
  ): Promise<UserView | null> {
    try {
      const data = await User.findOneBy({ username });
      if (!data) throw new Error('Username does not exists.');
      if (currentPassword) {
        const valid = await argon2.verify(data.password, currentPassword);
        if (!valid) throw new Error('Invalid current password.');
      }
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      } else if (newPassword !== confirmPassword) {
        throw new Error('Confirm password does not match.');
      }
      const hashedPassword = await argon2.hash(newPassword);
      User.merge(data, {
        password: hashedPassword,
        forceChgPassw: false
      });
      const response = await User.save(data);
      const result = await UserView.findOneBy({ username: response.username });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
