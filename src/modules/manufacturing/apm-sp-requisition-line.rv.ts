import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { SparePartReqLineInput } from './apm-sp-requisition-line.in';
import { SparePartReqLine } from './entities/apm-sp-requisition-line';
import { SparePartReqLineMach } from './entities/apm-sp-requisition-line-mach';
import { SparePartReqLineView } from './entities/apm-sp-requisition-line.vw';
import { SpareParts } from './entities/apm-spare-parts.vt';

@Resolver(SparePartReqLine)
export class SparePartReqLineResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkSPReqLineValid(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<boolean> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_Line_API.Check_Valid(:requisitionId, :lineItemNo) AS "isValid" FROM DUAL`;
      const result = await ifs.query(sql, [requisitionId, lineItemNo]);
      return result[0].isValid === 1 ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [SparePartReqLineView])
  @UseMiddleware(isAuth)
  async getSPRequisLinesByReqId(
    @Arg('requisitionId', () => Int) requisitionId: number
  ): Promise<SparePartReqLineView[] | undefined> {
    try {
      const data = await SparePartReqLineView.find({
        where: { requisitionId },
        order: { requisitionId: 'ASC' }
      });
      if (data.length > 0 && data[0].contract === 'AGT') {
        await Promise.all(
          data.map(async (item) => {
            const sql = `SELECT Inventory_Part_API.Get_Description@ifs8agt(:contract, :partNo) AS "description" FROM DUAL`;
            const result = await ifs.query(sql, [item.contract, item.partNo]);
            item.partDesc = result[0].description;
          })
        );
      }
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => SparePartReqLineView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSPRequisLine(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<SparePartReqLineView | null> {
    try {
      return await SparePartReqLineView.findOneBy({
        requisitionId,
        lineItemNo
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getNewSPReqLineNo(
    @Arg('requisitionId', () => Int) requisitionId: number
  ): Promise<number> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_Line_API.Get_New_Line_No(:requisitionId) AS "newLineNo" FROM DUAL`;
      const result = await ifs.query(sql, [requisitionId]);
      return result[0].newLineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [SpareParts], { nullable: true })
  @UseMiddleware(isAuth)
  async getSparePartsByContractPartNo(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<SpareParts[] | null> {
    try {
      let sql = '';
      if (contract === 'AGT') {
        sql = `
          SELECT part_no      AS "partNo",
                 contract     AS "contract",
                 description  AS "description",
                 NVL((SELECT SUM(qty_onhand) - SUM(qty_reserved)
                 FROM   inventory_part_in_stock@ifs8agt
                 WHERE  contract = p.contract
                 AND    part_no = p.part_no
                 AND    qty_onhand > 0),
                 0)           AS "qtyAvailable",
                 unit_meas    AS "unitMeas",
                 part_status  AS "partStatus",
                 objid        AS "objId"
          FROM   inventory_part@ifs8agt p
          WHERE  contract = :contract
          AND    (part_no LIKE '%' || UPPER(:part_no) || '%'
          OR      description LIKE '%' || UPPER(:part_no) || '%')
          AND    part_status IN ('A', 'I')
          AND    part_no LIKE 'S__-%'
        `;
      } else {
        sql = `
          SELECT part_no      AS "partNo",
                 contract     AS "contract",
                 description  AS "description",
                 NVL((SELECT SUM(qty_onhand) - SUM(qty_reserved)
                 FROM   inventory_part_in_stock
                 WHERE  contract = p.contract
                 AND    part_no = p.part_no
                 AND    qty_onhand > 0),
                 0)           AS "qtyAvailable",
                 unit_meas    AS "unitMeas",
                 part_status  AS "partStatus",
                 objid        AS "objId"
          FROM   inventory_part p
          WHERE  contract = :contract
          AND    (part_no LIKE '%' || UPPER(:part_no) || '%'
          OR      description LIKE '%' || UPPER(:part_no) || '%')
          AND    part_status IN ('A', 'I')
          AND    part_no LIKE 'S__-%'
        `;
      }
      const result = await ifs.query(sql, [contract, partNo]);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLine)
  @UseMiddleware(isAuth)
  async createSPRequisitionLine(
    @Arg('input') input: SparePartReqLineInput
  ): Promise<SparePartReqLine | undefined> {
    try {
      const data = SparePartReqLine.create({
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const result = await SparePartReqLine.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSPRequisitionLine(
    @Arg('input') input: SparePartReqLineInput
  ): Promise<SparePartReqLine | undefined> {
    try {
      const data = await SparePartReqLine.findOneBy({
        requisitionId: input.requisitionId,
        lineItemNo: input.lineItemNo
      });
      if (!data) throw new Error('No data found.');
      SparePartReqLine.merge(data, { ...input });
      const result = await SparePartReqLine.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLine)
  @UseMiddleware(isAuth)
  async deleteSPRequisitionLine(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<SparePartReqLine> {
    try {
      const data = await SparePartReqLine.findOneBy({
        requisitionId,
        lineItemNo
      });
      if (!data) throw new Error('No data found.');
      const detailData = await SparePartReqLineMach.findBy({
        requisitionId,
        lineItemNo
      });
      await Promise.all(
        detailData.map(async (item) => {
          try {
            await SparePartReqLineMach.delete({
              requisitionId: item.requisitionId,
              lineItemNo: item.lineItemNo,
              mapNo: item.mapNo
            });
          } catch (err) {
            throw new Error(mapError(err));
          }
        })
      );
      await SparePartReqLine.delete({ requisitionId, lineItemNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
