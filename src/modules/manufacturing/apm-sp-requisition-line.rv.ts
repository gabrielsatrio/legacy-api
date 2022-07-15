import config from '@/config/main';
import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { sendEmail } from '@/utils/send-email';
import oracledb from 'oracledb';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { EmployeeMaterializedViewResolver } from '../human-resources/employee-mv.rv';
import { SparePartReqLineInput } from './apm-sp-requisition-line.in';
import { SparePartReqLine } from './entities/apm-sp-requisition-line';
import { SparePartReqLineMach } from './entities/apm-sp-requisition-line-mach';
import { SparePartReqLineView } from './entities/apm-sp-requisition-line.vw';
import { SparePartRequisitionView } from './entities/apm-sp-requisition.vw';
import { SpareParts } from './entities/apm-spare-parts.vt';

import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LineReleaseNo {
  @Field(() => Int)
  lineItemNo!: number;

  @Field(() => Int)
  releaseNo!: number;
}

@Resolver(SparePartReqLine)
export class SparePartReqLineResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkSPReqLineValid(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('releaseNo', () => Int) releaseNo: number
  ): Promise<boolean> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_Line_API.Check_Valid(:requisitionId, :lineItemNo, :releaseNo) AS "isValid" FROM DUAL`;
      const result = await ifs.query(sql, [
        requisitionId,
        lineItemNo,
        releaseNo
      ]);
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
        order: { requisitionId: 'ASC', lineItemNo: 'ASC', releaseNo: 'ASC' }
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
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('releaseNo', () => Int) releaseNo: number
  ): Promise<SparePartReqLineView | null> {
    try {
      return await SparePartReqLineView.findOneBy({
        requisitionId,
        lineItemNo,
        releaseNo
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

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getNewSPReqReleaseNo(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number
  ): Promise<number> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_Line_API.Get_New_Release_No(:requisitionId, :lineItemNo) AS "releaseNo" FROM DUAL`;
      const result = await ifs.query(sql, [requisitionId, lineItemNo]);
      return result[0].releaseNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => LineReleaseNo)
  @UseMiddleware(isAuth)
  async getNewSPReqLineRelNo(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('partNo') partNo: string,
    @Arg('conditionCode') conditionCode: string
  ): Promise<LineReleaseNo> {
    try {
      const sql = `
        BEGIN
          ROB_APM_Sparepart_Req_Line_API.Get_New_Line_Rel_No(
            :requisitionId,
            :partNo,
            :conditionCode,
            :outLineItemNo,
            :outReleaseNo);
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      const result = await ifs.query(sql, [
        requisitionId,
        partNo,
        conditionCode,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const res = {
        lineItemNo: +result[0],
        releaseNo: +result[1]
      };
      return res;
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
          SELECT DISTINCT p.part_no AS "partNo",
                          p.contract AS "contract",
                          p.description AS "description",
                          NVL(
                            condition_code_manager_api.get_condition_code@ifs8agt(ps.part_no,
                                                                          ps.serial_no,
                                                                          ps.lot_batch_no),
                            'NORMAL') AS "conditionCode",
                          condition_code_api.get_description@ifs8agt(
                            NVL(
                              condition_code_manager_api.get_condition_code@ifs8agt(ps.part_no,
                                                                            ps.serial_no,
                                                                            ps.lot_batch_no),
                              'NORMAL')) AS "condition",
                          NVL((SELECT SUM(qty_onhand) - SUM(qty_reserved)
                              FROM   inventory_part_in_stock@ifs8agt
                              WHERE  contract = p.contract
                              AND    part_no = p.part_no
                              AND    qty_onhand > 0),
                              0) AS "qtyAvailable",
                          p.unit_meas AS "unitMeas",
                          p.part_status AS "partStatus",
                          p.part_status AS "partStatus",
                          p.objid
                            || NVL(
                                condition_code_manager_api.get_condition_code@ifs8agt(ps.part_no,
                                                                              ps.serial_no,
                                                                              ps.lot_batch_no),
                                'NORMAL') AS "objId"
          FROM   inventory_part@ifs8agt p,
                 inventory_part_in_stock@ifs8agt ps
          WHERE  ps.contract(+) = p.contract
          AND    ps.part_no(+) = p.part_no
          AND    p.contract = :contract
          AND    (p.part_no LIKE '%' || UPPER(:part_no) || '%'
          OR      p.description LIKE '%' || UPPER(:part_no) || '%')
          AND    p.part_status IN ('A', 'I')
          AND    p.part_no LIKE 'S__-%'
        `;
      } else {
        sql = `
          SELECT DISTINCT p.part_no AS "partNo",
                          p.contract AS "contract",
                          p.description AS "description",
                          NVL(
                            condition_code_manager_api.get_condition_code(ps.part_no,
                                                                          ps.serial_no,
                                                                          ps.lot_batch_no),
                            'NORMAL') AS "conditionCode",
                          condition_code_api.get_description(
                            NVL(
                              condition_code_manager_api.get_condition_code(ps.part_no,
                                                                            ps.serial_no,
                                                                            ps.lot_batch_no),
                              'NORMAL')) AS "condition",
                          NVL((SELECT SUM(qty_onhand) - SUM(qty_reserved)
                              FROM   inventory_part_in_stock
                              WHERE  contract = p.contract
                              AND    part_no = p.part_no
                              AND    qty_onhand > 0),
                              0) AS "qtyAvailable",
                          p.unit_meas AS "unitMeas",
                          p.part_status AS "partStatus",
                          p.part_status AS "partStatus",
                          p.objid
                            || NVL(
                                condition_code_manager_api.get_condition_code(ps.part_no,
                                                                              ps.serial_no,
                                                                              ps.lot_batch_no),
                                'NORMAL') AS "objId"
          FROM   inventory_part p,
                 inventory_part_in_stock ps
          WHERE  ps.contract(+) = p.contract
          AND    ps.part_no(+) = p.part_no
          AND    p.contract = :contract
          AND    (p.part_no LIKE '%' || UPPER(:part_no) || '%'
          OR      p.description LIKE '%' || UPPER(:part_no) || '%')
          AND    p.part_status IN ('A', 'I')
          AND    p.part_no LIKE 'S__-%'
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
      if (input.status === 'Canceled' && input.cancelReason === '') {
        throw new Error('Cancelation reason is required.');
      }
      const data = await SparePartReqLine.findOneBy({
        requisitionId: input.requisitionId,
        lineItemNo: input.lineItemNo,
        releaseNo: input.releaseNo
      });
      if (!data) throw new Error('No data found.');
      SparePartReqLine.merge(data, { ...input });
      const result = await SparePartReqLine.save(data);
      const { requisitionId, lineItemNo, releaseNo, status, cancelReason } =
        result;
      if (status === 'Canceled') {
        const sql = `
              BEGIN
                ROB_APM_Sparepart_Req_Line_API.Cancel__(
                  :requisitionId,
                  :lineItemNo,
                  :releaseNo);
              EXCEPTION
                WHEN OTHERS THEN
                  ROLLBACK;
                  RAISE;
              END;
            `;
        await ifs.query(sql, [requisitionId, lineItemNo, releaseNo]);
        const sparePartReq = await SparePartRequisitionView.findOneBy({
          requisitionId
        });
        let cc = '';
        switch (sparePartReq?.contract) {
          case 'AT1':
            cc = 'Admin Sparepart AT1 <adminspart@ateja.co.id>';
            break;
          case 'AT2':
            cc = 'Admin Sparepart AT2 <sparepartat2@ateja.co.id>';
            break;
          case 'AT3':
            cc = 'Admin Sparepart AT3 <adminpart3@ateja.co.id>';
            break;
          case 'AT4':
            cc = 'Admin Sparepart AT4 <sparepartat4@ateja.co.id>';
            break;
          case 'AT4E':
            cc = 'Admin Sparepart AT4E <gudangat4ext@ateja.co.id>';
            break;
          case 'AT6':
            cc = 'Admin Sparepart AT6 <adminpart3@ateja.co.id>';
            break;
          case 'AMI':
            cc = 'Unang Ridwan <unangridwan@ateja.co.id>';
            break;
          case 'AGT':
            cc = 'Mulyadi <mulyadi@agtex.co.id>';
            break;
          default:
            cc = '';
        }
        const employeeObj = new EmployeeMaterializedViewResolver();
        const creator = await employeeObj.getEmployeeMv(
          sparePartReq?.createdBy || ''
        );
        const approverLv1 = await employeeObj.getEmployeeMv(
          sparePartReq?.approverLv1 || ''
        );
        const approverLv2 = await employeeObj.getEmployeeMv(
          sparePartReq?.approverLv2 || ''
        );
        await sendEmail(
          [
            `${approverLv1?.name} <${approverLv1?.email}>`,
            `${approverLv2?.name} <${approverLv2?.email}>` || ''
          ],
          [`${creator?.name} <${creator?.email}>`, cc],
          [],
          `Spare Part Requisition No ${requisitionId} Line ${lineItemNo} Cancelation Notification`,
          `<p>Dear Mr/Ms,</p>
               <p>Spare Part Requisition No ${requisitionId} Line ${lineItemNo} has been canceled.</br>
               Cancelation Reason: <em>${cancelReason}</em></br>
               You can find the detail by clicking <a href="${config.client.url}/m/013/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</p>`
        );
      }
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartReqLine)
  @UseMiddleware(isAuth)
  async deleteSPRequisitionLine(
    @Arg('requisitionId', () => Int) requisitionId: number,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('releaseNo', () => Int) releaseNo: number
  ): Promise<SparePartReqLine> {
    try {
      const data = await SparePartReqLine.findOneBy({
        requisitionId,
        lineItemNo,
        releaseNo
      });
      if (!data) throw new Error('No data found.');
      const detailData = await SparePartReqLineMach.findBy({
        requisitionId,
        lineItemNo,
        releaseNo
      });
      await Promise.all(
        detailData.map(async (item) => {
          try {
            await SparePartReqLineMach.delete({
              requisitionId: item.requisitionId,
              lineItemNo: item.lineItemNo,
              releaseNo: item.releaseNo,
              mapNo: item.mapNo
            });
          } catch (err) {
            throw new Error(mapError(err));
          }
        })
      );
      await SparePartReqLine.delete({ requisitionId, lineItemNo, releaseNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
