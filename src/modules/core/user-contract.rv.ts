import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { UserContractView } from './entities/user-contract.vw';

@Resolver(UserContractView)
export class UserContractResolver {
  @Query(() => [UserContractView])
  @UseMiddleware(isAuth)
  async getAllUserContracts(): Promise<UserContractView[]> {
    try {
      return await UserContractView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [UserContractView])
  @UseMiddleware(isAuth)
  async getAllUserContractsByUsername(
    @Arg('username') username: string,
    @Arg('usernameDb') usernameDb: 'AT' | 'AG'
  ): Promise<UserContractView[]> {
    try {
      return await UserContractView.find({
        where: { username, usernameDb },
        order: {
          isDefault: 'DESC',
          contract: 'ASC'
        }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
