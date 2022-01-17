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
import { getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Context } from 'vm';
import { User } from './entities/user';
import { UserContractView } from './entities/user-contract.vw';
import { LoginInput } from './login.in';

const FORGET_PASSWORD_PREFIX = config.token.prefix;

@Resolver(User)
export class AuthResolver {
  @FieldResolver(() => String, { nullable: true })
  async defaultContract(@Root() user: User): Promise<string | null> {
    try {
      const userContract = await UserContractView.find({
        username: user.ifsUsername,
        usernameDb: user.usernameDb
      });
      if (!userContract) return null;
      else {
        const defaultContract = userContract.filter(
          (rec: UserContractView) => rec.isDefault === 'TRUE'
        );
        return defaultContract[0].contract;
      }
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @FieldResolver(() => [String], { nullable: true })
  async contract(@Root() user: User): Promise<string[] | null> {
    try {
      const userContract = await UserContractView.find({
        username: user.ifsUsername,
        usernameDb: user.usernameDb
      });
      const contract = [];
      if (!userContract) contract.push('');
      else {
        userContract.map((rec: UserContractView) => {
          contract.push(rec.contract);
        });
        /**
         ** Grant additional access to AGT site for the following users:
         ** - ATEJA    : Super User
         ** - HLDCCU02 : CCU
         ** - AT1GAP07 : SPT Project
         **/
        const specialUsers = ['ATEJA', 'HLDCCU02', 'AT1GAP07'];
        specialUsers.includes(user.ifsUsername) && contract.push('AGT');
      }
      return contract;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { req }: Context): Promise<User | null> {
    try {
      const username = req.session.username;
      if (!username) {
        throw new Error('You need to login first.');
      }
      const user = await User.findOne({ where: { username } });
      if (!user || user?.status === 'Inactive') return null;
      return user;
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
