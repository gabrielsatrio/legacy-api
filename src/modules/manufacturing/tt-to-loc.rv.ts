import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { ToLocTt } from './entities/tt-to-loc';

@Resolver(ToLocTt)
export class TTToLocResolver {
  @Query(() => [ToLocTt], { nullable: true })
  @UseMiddleware(isAuth)
  async getToLocByDept(
    @Arg('contract', () => [String])
    contract: string[],
    @Arg('dept') dept: string
  ): Promise<ToLocTt[] | undefined> {
    return await ToLocTt.find({
      where: { contract: In(contract), dept }
    });
  }
}
