import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Int, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { SoObatProsesMaterial } from './entities/mdp-so-obat-proses-mat';
import { SoObatProsesMaterialInput } from './mdp-so-proses-material.in';

@Resolver(SoObatProsesMaterial)
export class SoObatProsesResolver {
  @Mutation(() => SoObatProsesMaterial)
  @UseMiddleware(isAuth)
  async createSoObatProsesMaterial(
    @Arg('input') input: SoObatProsesMaterialInput
  ): Promise<SoObatProsesMaterial | null> {
    try {
      const sql = `
    BEGIN
    CHR_SO_OBAT_API.ADD_MATERIAL(
      :contract,
      :partNo,
      :orderNo,
      :qtyRequired,
      :scrapFactor,
      :scrapComponent,
      :berat,
      :structureLineNo);
    END;
  `;

      await ifs.query(sql, [
        input.contract,
        input.partNo,
        input.orderNo,
        input.qtyRequired,
        input.scrapFactor,
        input.scrapComponent,
        input.berat,
        input.structureLineNo
      ]);

      let currentQuery;

      if (input.contract === 'AGT') {
        currentQuery = `SELECT MAX(line_item_no) as "max"
      FROM   shop_material_alloc@ifs8agt
      WHERE  order_no = :orderNo`;
      } else {
        currentQuery = `SELECT MAX(line_item_no) as "max"
      FROM   shop_material_alloc
      WHERE  order_no = :orderNo`;
      }

      const maxLine = await ifs.query(currentQuery, [input.orderNo]);

      const data = await SoObatProsesMaterial.findOneBy({
        orderNo: input.orderNo,
        lineItemNo: maxLine[0].max
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SoObatProsesMaterial)
  @UseMiddleware(isAuth)
  async updateSoObatProsesMaterial(
    @Arg('input') input: SoObatProsesMaterialInput
  ): Promise<SoObatProsesMaterial | null> {
    try {
      const sql = `
    BEGIN
    CHR_SO_OBAT_API.UPDATE_MATERIAL_QTY(
      :contract,
      :orderNo,
      :lineItemNo,
      :berat,
      :qtyRequired);
    END;
  `;

      await ifs.query(sql, [
        input.contract,
        input.orderNo,
        input.lineItemNo,
        input.berat,
        input.qtyRequired
      ]);

      const data = await SoObatProsesMaterial.findOneBy({
        orderNo: input.orderNo,
        lineItemNo: input.lineItemNo
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SoObatProsesMaterial)
  @UseMiddleware(isAuth)
  async deleteSoObatProsesMaterial(
    @Arg('orderNo') orderNo: string,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<SoObatProsesMaterial | null> {
    try {
      const data = await SoObatProsesMaterial.findOneBy({
        orderNo: orderNo,
        lineItemNo: lineItemNo
      });

      if (!data) throw new Error('No data found.');

      const sql = `
                    BEGIN
                    CHR_SO_OBAT_API.DELETE_MATERIAL(
                      :orderNo,
                      :lineItemNo);
                    END;
                  `;

      await ifs.query(sql, [orderNo, lineItemNo]);

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
