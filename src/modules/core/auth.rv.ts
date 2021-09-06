import config from '@/config/main';
import { redis } from '@/providers/redis';
import { mapError } from '@/utils/map-error';
import { sendEmail } from '@/utils/send-email';
import argon2 from 'argon2';
import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { getConnection, ObjectLiteral } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Context } from 'vm';
import { User } from './entities/user';
import { LoginInput } from './login.in';
import { RegisterInput } from './register.in';

const FORGET_PASSWORD_PREFIX = config.token.prefix;

@Resolver(User)
export class AuthResolver {
  @FieldResolver(() => String, { nullable: true })
  async defaultContract(@Root() user: User): Promise<string | null> {
    const response = await User.findOne({
      join: {
        alias: 'user',
        leftJoinAndSelect: { userContract: 'user.contracts' }
      },
      where: (objectLiteral: ObjectLiteral) => {
        objectLiteral
          .where({ username: user.username })
          .andWhere('userContract.usernameDb = user.usernameDb')
          .andWhere('userContract.isDefault = :isDefault', {
            isDefault: 'TRUE'
          });
      }
    });
    if (typeof response?.contracts === 'undefined') return null;
    const defaultSite = response?.contracts[0].contract;
    return defaultSite;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | undefined> {
    const username = req.session.username;
    if (!username) {
      throw new Error('You need to login first.');
    }
    const user = await User.findOne({
      relations: ['contracts'],
      where: { username }
    });
    if (user?.status === 'Inactive') return undefined;
    return user;
  }

  @Mutation(() => User)
  async register(
    @Arg('input', { validate: true }) input: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<User | undefined> {
    try {
      const hashedPassword = await argon2.hash(input.password);
      const sql = `
        BEGIN
          ATJ_AUTH_API.Register(:username,
            :password,
            :departmentId,
            :usernameDb,
            :ifsUsername,
            :outUsername);
        END;
      `;
      const result = await getConnection().query(sql, [
        input.username,
        hashedPassword,
        input.departmentId,
        input.usernameDb,
        input.ifsUsername,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outUsername = result[0] as string;
      const data = User.findOne({ username: outUsername });
      req.session.username = outUsername;
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => User)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() { req }: Context
  ): Promise<User | undefined> {
    try {
      const user = await User.findOne({ username: input.username });
      if (!user) {
        throw new Error('Invalid username.');
      }
      const valid = await argon2.verify(user.password, input.password);
      if (!valid) {
        throw new Error('Invalid password.');
      }
      const data = await User.findOne({ username: input.username });
      req.session.username = user.username;
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
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
  async forgotPassword(@Arg('username') username: string): Promise<boolean> {
    try {
      const user = await User.findOne(username);
      if (!user) {
        return true;
      }
      const token = uuidv4();
      await redis.set(
        `${FORGET_PASSWORD_PREFIX}${token}`,
        user.username,
        'ex',
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

  @Mutation(() => User)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { req }: Context
  ): Promise<User | undefined> {
    try {
      const tokenKey = `${FORGET_PASSWORD_PREFIX}${token}`;
      if (newPassword.length < 3) {
        throw new Error(
          'Password must be longer than or equal to 3 characters.'
        );
      }
      const username = await redis.get(tokenKey);
      if (!username) {
        throw new Error('Token expired.');
      }
      const user = await User.findOne(username);
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
      const result = await getConnection().query(sql, [
        username,
        hashedPassword,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outUsername = result[0] as string;
      const data = User.findOne({ username: outUsername });
      await redis.del(tokenKey);
      req.session.username = outUsername;
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
