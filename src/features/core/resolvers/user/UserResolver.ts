import { isAuth } from '@/middlewares/isAuth';
import { Context } from '@/types/Context';
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
  async getUsers(): Promise<User[]> {
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUser(@Arg('id') id: number): Promise<boolean> {
    try {
      await User.delete(id);
      return true;
    } catch (err) {
      return false;
    }
  }
}
