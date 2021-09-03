import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { UserView } from './entities/user.vw';

@Resolver(UserView)
export class UserResolver {
  @Query(() => [UserView])
  @UseMiddleware(isAuth)
  async getAllUsers(): Promise<UserView[]> {
    return await UserView.find();
  }

  @Query(() => UserView, { nullable: true })
  @UseMiddleware(isAuth)
  async getUser(
    @Arg('username') username: string
  ): Promise<UserView | undefined> {
    return await UserView.findOne(username);
  }

  @Mutation(() => UserView)
  @UseMiddleware(isAuth)
  async deleteUser(@Arg('username') username: string): Promise<UserView> {
    try {
      const data = await UserView.findOne(username);
      if (!data) throw new Error('No data found.');
      await UserView.delete(username);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
