import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsPurchasePartView } from './entities/ifs-purchase-part.vw';

@Resolver(IfsPurchasePartView)
export class IfsPurchasePartResolver {
  @Query(() => IfsPurchasePartView)
  @UseMiddleware(isAuth)
  async getPurchasePart(
    @Arg('partNo', () => String) partNo: string,
    @Arg('contract', () => String) contract: string
  ): Promise<IfsPurchasePartView | null> {
    try {
      return await IfsPurchasePartView.findOneBy({ partNo, contract });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getPurchasePartUom(
    @Arg('partNo', () => String) partNo: string
  ): Promise<string | undefined> {
    try {
      const sql = `
      SELECT LISTAGG(default_buy_unit_meas, ', ') WITHIN GROUP (ORDER BY default_buy_unit_meas) AS "uom"
      FROM   (SELECT   part_no,
                       default_buy_unit_meas
              FROM     purchase_part
              WHERE    part_no = :p_part_no
              GROUP BY part_no, default_buy_unit_meas
              UNION
              SELECT   part_no,
                       default_buy_unit_meas
              FROM     purchase_part@ifs8agt
              WHERE    part_no = :p_part_no
              GROUP BY part_no, default_buy_unit_meas)
      `;
      const result = await ifs.query(sql, [partNo]);
      return result[0].uom || ' ';
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getPurchasePartSite(
    @Arg('partNo', () => String) partNo: string
  ): Promise<string | undefined> {
    try {
      const sql = `
      SELECT LISTAGG(contract, ', ') WITHIN GROUP (ORDER BY contract) AS "contract"
      FROM   (SELECT   part_no,
                 contract
        FROM     purchase_part
        WHERE    part_no = :p_part_no
        GROUP BY part_no, contract
        UNION
        SELECT   part_no,
                 contract
        FROM     purchase_part@ifs8agt
        WHERE    part_no = :p_part_no
        GROUP BY part_no, contract)
      `;
      const result = await ifs.query(sql, [partNo]);
      return result[0].contract || ' ';
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
