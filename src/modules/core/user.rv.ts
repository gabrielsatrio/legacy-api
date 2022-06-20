import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import argon2 from 'argon2';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from './entities/user';
import { UserView } from './entities/user.vw';
import { UserInput } from './user.in';

@Resolver(User)
export class UserResolver {
  @Query(() => [UserView])
  @UseMiddleware(isAuth)
  async getUsers(): Promise<UserView[]> {
    try {
      return await UserView.find({ order: { username: 'ASC' } });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => UserView, { nullable: true })
  @UseMiddleware(isAuth)
  async getUser(@Arg('username') username: string): Promise<UserView | null> {
    try {
      return await UserView.findOneBy({ username });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => UserView)
  @UseMiddleware(isAuth)
  async createUser(@Arg('input') input: UserInput): Promise<UserView | null> {
    try {
      const response = await UserView.findOneBy({ username: input.username });
      if (response) throw new Error('User already exist.');
      const hashedPassword = await argon2.hash(input.password);
      const sql = `
        BEGIN
          ATJ_AUTH_API.Register(:username,
            :password,
            :email,
            :departmentId,
            :usernameDb,
            :ifsUsername,
            :outUsername);
        END;
      `;
      const result = await ifs.query(sql, [
        input.username,
        hashedPassword,
        input.email,
        input.departmentId,
        input.usernameDb,
        input.ifsUsername,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outUsername = result[0] as string;
      const data = UserView.findOneBy({ username: outUsername });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => UserView)
  @UseMiddleware(isAuth)
  async updateUser(@Arg('input') input: UserInput): Promise<UserView | null> {
    try {
      if (input.password.length < 3) {
        throw new Error(
          'Password must be longer than or equal to 3 characters.'
        );
      }
      const data = await User.findOneBy({ username: input.username });
      if (!data) throw new Error('No data found.');
      const hashedPassword = await argon2.hash(input.password);
      User.merge(data, { ...input, password: hashedPassword });
      const response = await User.save(data);
      const result = await UserView.findOneBy({ username: response.username });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => UserView)
  @UseMiddleware(isAuth)
  async deleteUser(@Arg('username') username: string): Promise<UserView> {
    try {
      const data = await UserView.findOneBy({ username });
      if (!data) throw new Error('No data found.');
      await User.delete(username);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
