import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { setErrors } from '@/utils/set-errors';
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
import { UserResponse } from './user.dr';

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

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async deleteUser(@Arg('id') id: number): Promise<UserResponse> {
    const user = await User.findOne(id);
    if (!user) return setErrors('No data found.');
    try {
      await User.delete(id);
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
