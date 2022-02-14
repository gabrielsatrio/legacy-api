import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { OpnameInventoryLocationView } from './entities/opname-inv-loc.vw';

@Resolver(OpnameInventoryLocationView)
export class OpnameInventoryLocationViewResolver {
  @Query(() => [OpnameInventoryLocationView], { nullable: true })
  @UseMiddleware(isAuth)
  async getRandomLocation(
    @Arg('contract') contract: string,
    @Arg('numOfLoc') numOfLoc: number,
    @Arg('username') username: string
  ): Promise<OpnameInventoryLocationView[] | undefined> {
    return await OpnameInventoryLocationView.createQueryBuilder('IL')
      .where('IL.CONTRACT = :contract', { contract: contract })
      .andWhere('ROWNUM <= :numOfLoc', { numOfLoc: numOfLoc })
      .andWhere(
        `LOCATION_NO NOT LIKE (CASE WHEN :username = 'AT1GAP02' THEN 'AT3%' ELSE 'AT10' END)`,
        { username: username }
      )
      .getMany();
  }
}
