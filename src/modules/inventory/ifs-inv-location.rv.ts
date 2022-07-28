import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like } from 'typeorm';
import { IfsInvLocationView } from './entities/ifs-inv-location.vw';

@Resolver(IfsInvLocationView)
export class IfsInventoryLocationResolver {
  @Query(() => [IfsInvLocationView], { nullable: true })
  @UseMiddleware(isAuth)
  async getInventoryLocationByDept(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('warehouseId') warehouseId: string
  ): Promise<IfsInvLocationView[] | undefined> {
    let sql = '';
    if (contract[0] === 'AGT') {
      sql = `
        SELECT contract      AS "contract",
               WAREHOUSE_ID  AS "warehouseId",
               LOCATION_NO   AS "locationNo",
               OBJID         AS "objId"
        FROM   WAREHOUSE_BAY_BIN@ifs8agt
        WHERE  contract = :contract
        AND    WAREHOUSE_ID like :warehouseId||'%'
      `;
      const result = await ifs.query(sql, ['AGT', warehouseId]);
      return result;
    } else {
      return await IfsInvLocationView.find({
        where: { contract: In(contract), warehouseId: Like(`${warehouseId}%`) }
      });
    }
  }
}
