import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import argon2 from 'argon2';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from './entities/user';
import { UserInput } from './user.in';

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getUsers(): Promise<User[]> {
    try {
      return await User.find({ order: { username: 'ASC' } });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async getUser(@Arg('username') username: string): Promise<User | null> {
    try {
      return await User.findOneBy({ username });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async createUser(@Arg('input') input: UserInput): Promise<User | null> {
    try {
      const response = await User.findOneBy({ username: input.username });
      if (response) throw new Error('User already exist.');
      const hashedPassword = await argon2.hash(input.password);
      const existingData = await User.findOneBy({
        username: input.username
      });
      if (existingData) throw new Error('Data already exists.');
      const data = User.create({
        username: input.username,
        password: hashedPassword,
        name: input.name,
        email: input.email
      });
      const results = await User.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateUser(@Arg('input') input: UserInput): Promise<User | null> {
    try {
      if (input.password.length < 3) {
        throw new Error(
          'Password must be longer than or equal to 3 characters.'
        );
      }
      const data = await User.findOneBy({ username: input.username });
      if (!data) throw new Error('No data found.');
      const hashedPassword = await argon2.hash(input.password);
      User.merge(data, {
        ...input,
        email: input.email.trim(),
        password: hashedPassword
      });
      const response = await User.save(data);
      const result = await User.findOneBy({ username: response.username });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async deleteUser(@Arg('username') username: string): Promise<User> {
    try {
      const data = await User.findOneBy({ username });
      if (!data) throw new Error('No data found.');
      await User.delete(username);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
