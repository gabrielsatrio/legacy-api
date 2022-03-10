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
    @Arg('dept') dept: string,
    @Arg('exclude') exclude: string
  ): Promise<OpnameInventoryLocationView[] | undefined> {
    return await OpnameInventoryLocationView.createQueryBuilder('IL')
      .where(
        `IL.CONTRACT = CASE WHEN :contract = 'AT3' and :dept = 'FG1' then 'AT1' else :contract end`,
        { contract }
      )
      .andWhere('ROWNUM <= :numOfLoc', { numOfLoc })
      .andWhere(
        `LOCATION_NO NOT LIKE (CASE WHEN :contract = 'AT1' and :dept = 'FG1' THEN '%AT3%' ELSE 'AT10' END)`,
        { dept }
      )
      .andWhere(
        `LOCATION_NO LIKE (CASE WHEN :contract = 'AT3' and :dept = 'FG1' THEN '%AT3%' ELSE '%' END)`
      )
      .andWhere(`DEPT = :dept`)
      .andWhere(
        `PART_NO NOT LIKE (CASE WHEN :exclude = 'true' then '%FB%' ELSE 'X' END)`,
        { exclude }
      )
      .orderBy(`DBMS_RANDOM.VALUE`)
      .getMany();
  }
}
