import { isAuth } from '@/middlewares/isAuth';
import { Context } from '@/types/Context';
import { setErrors } from '@/utils/setErrors';
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
import { User } from '../../entities/User';
import { UserResponse } from './types/UserResponse';

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
  async getAllUsers(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => User, { nullable: true })
  async getUser(@Arg('id') id: number): Promise<User | undefined> {
    return await User.findOne(id);
  }

  @Query(() => User, { nullable: true })
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
