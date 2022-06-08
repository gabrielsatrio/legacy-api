import config from '@/config/main';
import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import { sendEmail } from '@/utils/send-email';
import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { EmployeeResolver } from './../human-resources/org-employee.rv';
import { SparePartReqLineResolver } from './apm-sp-requisition-line.rv';
import { SparePartRequisitionInput } from './apm-sp-requisition.in';
import { SparePartRequisition } from './entities/apm-sp-requisition';
import { SparePartReqLine } from './entities/apm-sp-requisition-line';
import { SparePartRequisitionView } from './entities/apm-sp-requisition.vw';

@Resolver(SparePartRequisition)
export class SparePartRequisitionResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkSPReqValid(
    @Arg('requisitionId', () => Int) requistionId: number
  ): Promise<boolean> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_API.Check_Valid(:requisitionId) AS "checkValid" FROM DUAL`;
      const result = await ifs.query(sql, [requistionId]);
      return result[0].checkValid === 1 ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [SparePartRequisition])
  @UseMiddleware(isAuth)
  async getSPRequisitions(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<SparePartRequisition[] | undefined> {
    return await SparePartRequisition.find({
      where: { contract: In(contract) },
      order: { requisitionId: 'ASC' }
    });
  }

  @Query(() => [SparePartRequisitionView])
  @UseMiddleware(isAuth)
  async getSPRequisitionsByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<SparePartRequisitionView[] | undefined> {
    return await SparePartRequisitionView.find({
      where: { contract: In(contract) },
      order: { requisitionId: 'ASC' }
    });
  }

  @Query(() => SparePartRequisitionView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSPRequisition(
    @Arg('requisitionId', () => Int) requisitionId: number
  ): Promise<SparePartRequisitionView | null> {
    return await SparePartRequisitionView.findOneBy({ requisitionId });
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getNewSPRequisId(): Promise<number> {
    try {
      const sql = `SELECT ROB_APM_SP_REQUISITION_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartRequisition)
  @UseMiddleware(isAuth)
  async createSPRequisition(
    @Arg('input') input: SparePartRequisitionInput,
    @Ctx() { req }: Context
  ): Promise<SparePartRequisition | undefined> {
    try {
      const createdBy = req.session.username;
      const employee = new EmployeeResolver();
      const creator = await employee.getEmployeeWithCustomEmail(createdBy);
      const approverLv1 = await employee.getEmployeeWithCustomEmail(
        input.approverLv1
      );
      const approverLv2 = await employee.getEmployeeWithCustomEmail(
        input.approverLv2
      );
      const data = SparePartRequisition.create({
        ...input,
        nameApprLv1: approverLv1?.name,
        emailApprLv1: approverLv1?.email,
        nameApprLv2: approverLv2?.name,
        emailApprLv2: approverLv2?.email,
        createdBy,
        nameCreatedBy: creator?.name,
        emailCreatedBy: creator?.email,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const result = await SparePartRequisition.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartRequisition, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSPRequisition(
    @Arg('input') input: SparePartRequisitionInput
  ): Promise<SparePartRequisition | undefined> {
    try {
      const data = await SparePartRequisition.findOneBy({
        requisitionId: input.requisitionId
      });
      if (!data) throw new Error('No data found.');
      let sql: string;
      let outOrderNo: string;
      if (!input.orderNo && (input.status === 'Approved' || input.urgent)) {
        sql = `
          BEGIN
            ATJ_Material_Requisition_API.New__(
              :contract,
              :intCustomerNo,
              :destinationId,
              :dueDate,
              :dateEntered,
              :outOrderNo);
          EXCEPTION
            WHEN OTHERS THEN
              ROLLBACK;
              RAISE;
          END;
        `;
        let result = await ifs.query(sql, [
          input.contract,
          input.intCustomerNo,
          input.destinationId,
          input.dueDate,
          input.createdAt,
          { dir: oracledb.BIND_OUT, type: oracledb.STRING }
        ]);
        outOrderNo = result[0] as string;
        if (outOrderNo) {
          input.orderNo = outOrderNo;
          const requisLines = await SparePartReqLine.find({
            where: { requisitionId: input.requisitionId },
            order: { requisitionId: 'ASC', lineItemNo: 'ASC' }
          });
          await Promise.all(
            requisLines.map(async (item) => {
              sql = `
                BEGIN
                  ATJ_Material_Requis_Line_API.New__(
                    :orderNo,
                    :contract,
                    :orderClass,
                    :partNo,
                    :conditionCode,
                    :qtyDue,
                    :dueDate,
                    :noteText,
                    :supplyCode,
                    :outLineItemNo,
                    :outReleaseNo);
                EXCEPTION
                  WHEN OTHERS THEN
                    ROLLBACK;
                    RAISE;
                END;
              `;
              result = await ifs.query(sql, [
                outOrderNo,
                item.contract,
                'INT',
                item.partNo,
                item.conditionCode,
                item.qtyDue,
                input.dueDate,
                item.note,
                'Inventory Order',
                { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                { dir: oracledb.BIND_OUT, type: oracledb.STRING }
              ]);
            })
          );
        }
      }
      if (input.orderNo && input.status === 'Approved') {
        sql = `
          BEGIN
            ATJ_Material_Requisition_API.Release__(:orderNo);
          EXCEPTION
            WHEN OTHERS THEN
              ROLLBACK;
              RAISE;
          END;
        `;
        await ifs.query(sql, [input.orderNo]);
      }
      SparePartRequisition.merge(data, { ...input });
      const result = await SparePartRequisition.save(data);
      const { requisitionId, orderNo, createdBy } = result;
      if (input.status === 'Approved') {
        const sql = `
          BEGIN
            ROB_APM_MR_Sparepart_Map_API.insert_from_mr__(:orderNo);
          EXCEPTION
            WHEN OTHERS THEN
              ROLLBACK;
              RAISE;
          END;
        `;
        await ifs.query(sql, [orderNo]);
      }
      const employee = new EmployeeResolver();
      const creator = await employee.getEmployeeWithCustomEmail(createdBy);
      const approverLv1 = await employee.getEmployeeWithCustomEmail(
        result.approverLv1
      );
      const approverLv2 = await employee.getEmployeeWithCustomEmail(
        result.approverLv2
      );
      switch (input.status) {
        case 'Submitted':
          await sendEmail(
            approverLv1?.email || '',
            `Approval Request for Spare Part Requisition No ${requisitionId}`,
            `<p>Dear Mr/Ms ${approverLv1?.name},</p>
            <p>A new Spare Part Requisition (No: ${requisitionId}) has been submitted for your approval.</br>
            You can find all the details about this request by clicking <a href="${config.client.url}/m/013/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</br>
            Please confirm your approval.</p>`
          );
          break;
        case 'Partially Approved':
          await sendEmail(
            approverLv2?.email || '',
            `Approval Request for Spare Part Requisition No ${requisitionId}`,
            `<p>Dear Mr/Ms ${approverLv2?.name},</p>
            <p>A new Spare Part Requisition (No: ${requisitionId}) has been submitted for your approval.</br>
            You can find all the details about this request by clicking <a href="${config.client.url}/m/013/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</br>
            Please confirm your approval.</p>`
          );
          break;
        case 'Approved':
          await sendEmail(
            creator?.email || '',
            `Spare Part Requisition No ${requisitionId} has been Approved`,
            `<p>Dear Mr/Ms ${creator?.name},</p>
            <p>Spare Part Requisition No: ${requisitionId} has been approved and Material Requisition No ${orderNo} has been created in IFS Applications.</br>
            You can find all the details by clicking <a href="${config.client.url}/m/013/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</p>`
          );
          break;
        case 'Rejected':
          await sendEmail(
            creator?.email || '',
            `Spare Part Requisition No ${result.requisitionId} has been Rejected`,
            `<p>Dear Mr/Ms ${creator?.name},</p>
            <p>Spare Part Requisition No: ${result.requisitionId} has been rejected.</br>
            You can find all the details by clicking <a href="${config.client.url}/m/013/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</p>`
          );
          break;
        default:
          null;
      }
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartRequisition, { nullable: true })
  @UseMiddleware(isAuth)
  async deleteSPRequisition(
    @Arg('requisitionId', () => Int) requisitionId: number
  ): Promise<SparePartRequisition | null> {
    try {
      const data = await SparePartRequisition.findOneBy({ requisitionId });
      if (!data) return null;
      const detailData = await SparePartReqLine.findBy({ requisitionId });
      const SPReqLine = new SparePartReqLineResolver();
      await Promise.all(
        detailData.map(async (item) => {
          try {
            await SPReqLine.deleteSPRequisitionLine(
              item.requisitionId,
              item.lineItemNo
            );
          } catch (err) {
            throw new Error(mapError(err));
          }
        })
      );
      await SparePartRequisition.delete({ requisitionId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
