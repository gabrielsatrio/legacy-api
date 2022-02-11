import config from '@/config/main';
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
import { getConnection, In } from 'typeorm';
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
      const result = await getConnection().query(sql, [requistionId]);
      return result[0].checkValid === 1 ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
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
  ): Promise<SparePartRequisitionView | undefined> {
    return await SparePartRequisitionView.findOne({ requisitionId });
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getNewSPRequisId(): Promise<number> {
    try {
      const sql = `SELECT ROB_APM_SP_REQUISITION_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await getConnection().query(sql);
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
      const data = await SparePartRequisition.findOne({
        requisitionId: input.requisitionId
      });
      if (!data) throw new Error('No data found.');
      let outOrderNo: string;
      if (input.status === 'Approved' || input.urgent) {
        let sql = `
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
        let result = await getConnection().query(sql, [
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
            requisitionId: input.requisitionId
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
              result = await getConnection().query(sql, [
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
          if (input.status === 'Approved') {
            sql = `
              BEGIN
                ATJ_Material_Requisition_API.Release__(:orderNo);
              EXCEPTION
                WHEN OTHERS THEN
                  ROLLBACK;
                  RAISE;
              END;
            `;
            await getConnection().query(sql, [outOrderNo]);
          }
        }
      }
      SparePartRequisition.merge(data, input);
      const result = await SparePartRequisition.save(data);
      const { requisitionId, orderNo, createdBy } = result;
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
            You can find all the details about this request by clicking <a href="${config.client.url}/m/001/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</br>
            Please confirm your approval.</p>`
          );
          break;
        case 'Partially Approved':
          await sendEmail(
            approverLv2?.email || '',
            `Approval Request for Spare Part Requisition No ${requisitionId}`,
            `<p>Dear Mr/Ms ${approverLv2?.name},</p>
            <p>A new Spare Part Requisition (No: ${requisitionId}) has been submitted for your approval.</br>
            You can find all the details about this request by clicking <a href="${config.client.url}/m/001/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</br>
            Please confirm your approval.</p>`
          );
          break;
        case 'Approved':
          await sendEmail(
            creator?.email || '',
            `Spare Part Requisition No ${requisitionId} has been Approved`,
            `<p>Dear Mr/Ms ${creator?.name},</p>
            <p>Spare Part Requisition No: ${requisitionId} has been approved and Material Requisition No ${orderNo} has been created in IFS Applications.</p>`
          );
          break;
        case 'Rejected':
          await sendEmail(
            creator?.email || '',
            `Spare Part Requisition No ${result.requisitionId} has been Rejected`,
            `<p>Dear Mr/Ms ${creator?.name},</p>
            <p>Spare Part Requisition No: ${result.requisitionId} has been rejected.</p>`
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

  @Mutation(() => SparePartRequisition)
  @UseMiddleware(isAuth)
  async deleteSPRequisition(
    @Arg('requisitionId', () => Int) requisitionId: number
  ): Promise<SparePartRequisition> {
    try {
      const data = await SparePartRequisition.findOne({ requisitionId });
      if (!data) throw new Error('No data found.');
      const detailData = await SparePartReqLine.find({ requisitionId });
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
