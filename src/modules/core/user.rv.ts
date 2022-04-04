import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import argon2 from 'argon2';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { User } from './entities/user';
import { UserInput } from './user.in';

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getAllUsers(): Promise<User[]> {
    return await User.find({ order: { username: 'ASC' } });
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async getUser(@Arg('username') username: string): Promise<User | undefined> {
    return await User.findOne(username);
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async createUser(@Arg('input') input: UserInput): Promise<User | undefined> {
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
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateUser(@Arg('input') input: UserInput): Promise<User | undefined> {
    try {
      if (input.password.length < 3) {
        throw new Error(
          'Password must be longer than or equal to 3 characters.'
        );
      }
      const data = await User.findOne({
        username: input.username
      });
      if (!data) throw new Error('No data found.');
      const hashedPassword = await argon2.hash(input.password);
      User.merge(data, { ...input, password: hashedPassword });
      const results = await User.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async changePassword(
    @Arg('username') username: string,
    @Arg('currentPassword') currentPassword: string,
    @Arg('newPassword') newPassword: string,
    @Arg('confirmPassword') confirmPassword: string
  ): Promise<User | undefined> {
    try {
      const data = await User.findOne({
        username: username
      });

      if (!data) throw new Error('No data found.');
      const check = await argon2.verify(data.password, currentPassword);

      if (newPassword.length < 3) {
        throw new Error(
          'Password must be longer than or equal to 3 characters.'
        );
      } else if (newPassword != confirmPassword) {
        throw new Error(
          'Confirm Password does not match.'
        );
      } else if (!check) {
        throw new Error('Invalid current password.');
      }

      const hashedPassword = await argon2.hash(newPassword);
      User.merge(data, { password: hashedPassword });
      const results = await User.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async deleteUser(@Arg('username') username: string): Promise<User> {
    try {
      const data = await User.findOne(username);
      if (!data) throw new Error('No data found.');
      await User.delete(username);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
