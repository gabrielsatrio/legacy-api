import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import { User } from './entities/user';

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  fullName(@Root() user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: Context): string {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return '';
  }

  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getAllUsers(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async getUser(@Arg('id') id: number): Promise<User | undefined> {
    return await User.findOne(id);
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async getUserByUsername(
    @Arg('username') username: string
  ): Promise<User | undefined> {
    return await User.findOne({ username });
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async deleteUser(@Arg('id') id: number): Promise<User> {
    const data = await User.findOne(id);
    if (!data) throw new Error('No data found.');
    try {
      await User.delete(id);
      return data;
    } catch (err) {
      throw new Error(mapError(err.message));
    }
  }
}
