import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from './entities/user';

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getAllUsers(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async getUser(@Arg('username') username: string): Promise<User | undefined> {
    return await User.findOne(username);
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
