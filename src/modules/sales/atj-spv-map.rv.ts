import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { SpvMap } from './entities/atj-spv-map';

@Resolver(SpvMap)
export class SpvMapResolver {
  @Query(() => [SpvMapResolver])
  @UseMiddleware(isAuth)
  async getAllSpvMap(): Promise<SpvMap[] | undefined> {
    return await SpvMap.find();
  }
}
