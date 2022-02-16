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
      .where(
        `IL.CONTRACT = CASE WHEN :contract = 'AT3' then 'AT1' else :contract end`,
        { contract: contract }
      )
      .andWhere('ROWNUM <= :numOfLoc', { numOfLoc: numOfLoc })
      .andWhere(
        `LOCATION_NO NOT LIKE (CASE WHEN :username like 'AT1GAP%' THEN '%AT3%' ELSE 'AT10' END)`,
        { username: username }
      )
      .andWhere(
        `LOCATION_NO LIKE (CASE WHEN :username = 'AT3GAP02' THEN '%AT3%' ELSE '%' END)`,
        { username: username }
      )
      .andWhere(
        `DEPT = (CASE WHEN :username in ('AT1GAP06', 'AT2GAP05', 'AT3GAP05', 'AT4GAP05', 'ATEGAP01', 'AMIGAP01', 'AGTGAP02') THEN 'SP1' ELSE 'FG1' END) `
      )
      .orderBy(`DBMS_RANDOM.VALUE`)
      .getMany();
  }
}
