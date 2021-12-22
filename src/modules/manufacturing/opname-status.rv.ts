import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { OpnameStatus } from './entities/opname-status';

@Resolver(OpnameStatus)
export class OpnameStatusResolver {
  @Query(() => [OpnameStatus])
  @UseMiddleware(isAuth)
  async getOpnameStatus(
    @Arg('contract') contract: string,
    @Arg('username') username: string
  ): Promise<OpnameStatus[] | undefined> {
    return await OpnameStatus.find({
      where: {
        contract: contract,
        username: username
      }
    });
  }
}
