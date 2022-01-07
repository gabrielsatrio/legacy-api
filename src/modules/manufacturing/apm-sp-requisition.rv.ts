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
import { SparePartReqLineResolver } from './apm-sp-requisition-line.rv';
import { SparePartRequisitionInput } from './apm-sp-requisition.in';
import { SparePartRequisition } from './entities/apm-sp-requisition';
import { SparePartReqLine } from './entities/apm-sp-requisition-line';
import { SparePartRequisitionView } from './entities/apm-sp-requisition.vw';
@Resolver(SparePartRequisition)
export class SparePartRequisitionResolver {
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
      const sql = `SELECT ATJ_EMP_API.Get_Email(:approver) AS "emailAppr" FROM DUAL`;
      const resultForCreatedBy = await getConnection().query(sql, [
        req.session.username
      ]);
      const emailCreatedBy = resultForCreatedBy[0].emailAppr;
      const resultForApproverLv1 = await getConnection().query(sql, [
        input.approverLv1
      ]);
      const emailApprLv1 = resultForApproverLv1[0].emailAppr;
      console.log('>> emailApprvLv1: ', emailApprLv1);
      const resultForApproverLv2 = await getConnection().query(sql, [
        input.approverLv2
      ]);
      const emailApprLv2 = resultForApproverLv2[0].emailAppr;
      console.log('>> emailApprvLv2: ', emailApprLv2);
      const data = SparePartRequisition.create({
        ...input,
        emailApprLv1,
        emailApprLv2,
        createdBy: req.session.username,
        emailCreatedBy,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const results = await SparePartRequisition.save(data);
      return results;
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
      if (input.status === 'Approved') {
        let sql = `
          BEGIN
            ATJ_Material_Requisition_API.New__(
              :contract,
              :intCustomerNo,
              :destinationId,
              :dueDate,
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
      SparePartRequisition.merge(data, input);
      const results = await SparePartRequisition.save(data);
      const sql = `
        SELECT atj_emp_api.get_name(:createdby)   AS "creatorName",
               atj_emp_api.get_name(:approverlv1) AS "approverLv1Name",
               atj_emp_api.get_name(:approverlv2) AS "approverLv2Name"
        FROM   DUAL
      `;
      const result = await getConnection().query(sql, [
        results.createdBy,
        results.approverLv1,
        results.approverLv2
      ]);
      const creatorName = result[0].creatorName;
      const approverLv1Name = result[0].approverLv1Name;
      const approverLv2Name = result[0].approverLv2Name;
      switch (input.status) {
        case 'Submitted':
          await sendEmail(
            results.emailApprLv1,
            `Approval Request for Spare Part Requisition No ${results.requisitionId}`,
            `<p>Dear Mr/Ms ${approverLv1Name},</p>
            <p>A new Spare Part Requisition (No: ${results.requisitionId}) has been submitted for your approval.</br>
            You can find all the details about this request by clicking <a href="${config.client.url}/m/001/sp-requisitions/add?requisitionId=${results.requisitionId}"><b>here</b></a>.</br>
            Please confirm your approval.</p>`
          );
          break;
        case 'Partially Approved':
          await sendEmail(
            results.emailApprLv2,
            `Approval Request for Spare Part Requisition No ${results.requisitionId}`,
            `<p>Dear Mr/Ms ${approverLv2Name},</p>
            <p>A new Spare Part Requisition (No: ${results.requisitionId}) has been submitted for your approval.</br>
            You can find all the details about this request by clicking <a href="${config.client.url}/m/001/sp-requisitions/add?requisitionId=${results.requisitionId}"><b>here</b></a>.</br>
            Please confirm your approval.</p>`
          );
          break;
        case 'Approved':
          await sendEmail(
            results.emailCreatedBy,
            `Spare Part Requisition No ${results.requisitionId} has been Approved`,
            `<p>Dear Mr/Ms ${creatorName},</p>
            <p>Spare Part Requisition No: ${results.requisitionId} has been approved and Material Requisition No ${results.orderNo} has been created in IFS Applications.</p>`
          );
          break;
        case 'Rejected':
          await sendEmail(
            results.emailCreatedBy,
            `Spare Part Requisition No ${results.requisitionId} has been Rejected`,
            `<p>Dear Mr/Ms ${creatorName},</p>
            <p>Spare Part Requisition No: ${results.requisitionId} has been rejected.</p>`
          );
          break;
        default:
          null;
      }
      return results;
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

  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async isSPReqValid(
    @Arg('requisitionId', () => Int) requistionId: number
  ): Promise<boolean> {
    try {
      const sql = `SELECT ROB_APM_Sparepart_Req_API.Is_Valid(:requisitionId) AS "isValid" FROM DUAL`;
      const result = await getConnection().query(sql, [requistionId]);
      return result[0].isValid === 1 ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
