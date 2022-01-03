import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { InventoryLocation } from './entities/opname-inv-loc.vw';

@Resolver(InventoryLocation)
export class InventoryLocationResolver {
  @Query(() => [InventoryLocation], { nullable: true })
  @UseMiddleware(isAuth)
  async getRandomLocation(
    @Arg('contract') contract: string,
    @Arg('numOfLoc') numOfLoc: number
  ): Promise<InventoryLocation[] | undefined> {
    return await InventoryLocation.createQueryBuilder('IL')
      .where('IL.CONTRACT = :contract', { contract: contract })
      .andWhere('ROWNUM <= :numOfLoc', { numOfLoc: numOfLoc })
      .getMany();
  }
  // async getRandomLocation(
  //   @Arg('contract') contract: string,
  //   @Arg('numOfLoc') numOfLoc: number
  // ): Promise<InventoryLocation[] | undefined> {
  //   try {
  //     const sql = `SELECT DISTINCT location_no
  //     FROM   (SELECT   DISTINCT (bay_no || '-' || row_no || '-' || tier_no) AS location_no
  //             FROM     inventory_location
  //             WHERE    location_no LIKE 'FG%'
  //             AND      contract = :contract
  //             ORDER BY DBMS_RANDOM.VALUE)
  //     WHERE  ROWNUM <= :numOfLoc`;

  //     // const sql1 = `SELECT LISTAGG(location_no, ';') WITHIN GROUP (ORDER BY location_no) AS location_no
  //     // FROM   (SELECT   DISTINCT (bay_no || '-' || row_no || '-' || tier_no) AS location_no
  //     //         FROM     inventory_location
  //     //         WHERE    location_no LIKE 'FG%'
  //     //         AND      contract = :contract
  //     //         ORDER BY DBMS_RANDOM.VALUE)
  //     // WHERE  ROWNUM <= 4`;
  //     return await getConnection().query(sql, [contract, numOfLoc]);
  //   } catch (err) {
  //     throw new Error(mapError(err));
  //   }
  // }
}
