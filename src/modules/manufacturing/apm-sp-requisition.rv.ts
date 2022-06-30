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
import { EmployeeMaterializedViewResolver } from '../human-resources/employee-mv.rv';
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
    try {
      return await SparePartRequisition.find({
        where: { contract: In(contract) },
        order: { requisitionId: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [SparePartRequisitionView])
  @UseMiddleware(isAuth)
  async getSPRequisitionsByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<SparePartRequisitionView[] | undefined> {
    try {
      return await SparePartRequisitionView.find({
        where: { contract: In(contract) },
        order: { requisitionId: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => SparePartRequisitionView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSPRequisition(
    @Arg('requisitionId', () => Int) requisitionId: number
  ): Promise<SparePartRequisitionView | null> {
    try {
      return await SparePartRequisitionView.findOneBy({ requisitionId });
    } catch (err) {
      throw new Error(mapError(err));
    }
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
      const employeeObj = new EmployeeMaterializedViewResolver();
      const creator = await employeeObj.getEmployeeMv(createdBy);
      const approverLv1 = await employeeObj.getEmployeeMv(input.approverLv1);
      const approverLv2 = await employeeObj.getEmployeeMv(input.approverLv2);
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
      if (
        data.orderNo === null &&
        (input.status === 'Approved' || input.urgent)
      ) {
        sql = `
          BEGIN
            ROB_APM_Sparepart_Req_API.Create_MR_By_Req_Id__(
              :requisitionId,
              :outOrderNo);
          EXCEPTION
            WHEN OTHERS THEN
              ROLLBACK;
              RAISE;
          END;
        `;
        const result = await ifs.query(sql, [
          input.requisitionId,
          { dir: oracledb.BIND_OUT, type: oracledb.STRING }
        ]);
        input.orderNo = result[0] as string;
      }
      SparePartRequisition.merge(data, { ...input });
      const result = await SparePartRequisition.save(data);
      const { requisitionId, contract, orderNo, createdBy } = result;
      if (orderNo !== null && input.status === 'Approved') {
        sql = `
          BEGIN
            ATJ_Material_Requisition_API.Release__(:orderNo);
            ROB_APM_MR_Sparepart_Map_API.Insert_From_MR__(:orderNo);
          EXCEPTION
            WHEN OTHERS THEN
              ROLLBACK;
              RAISE;
          END;
        `;
        await ifs.query(sql, [orderNo]);
      }
      let cc = '';
      switch (contract) {
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
      const creator = await employeeObj.getEmployeeMv(createdBy);
      const approverLv1 = await employeeObj.getEmployeeMv(result.approverLv1);
      const approverLv2 = await employeeObj.getEmployeeMv(result.approverLv2);
      switch (input.status) {
        case 'Submitted':
          await sendEmail(
            `${approverLv1?.name} <${approverLv1?.email}>` || '',
            [],
            [],
            `Approval Request for Spare Part Requisition No ${requisitionId}`,
            `<p>Dear Mr/Ms ${approverLv1?.name},</p>
            <p>A new Spare Part Requisition (No: ${requisitionId}) has been submitted for your approval.</br>
            You can find all the details about this request by clicking <a href="${config.client.url}/m/013/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</br>
            Please confirm your approval.</p>`
          );
          break;
        case 'Partially Approved':
          await sendEmail(
            `${approverLv2?.name} <${approverLv2?.email}>` || '',
            [],
            [],
            `Approval Request for Spare Part Requisition No ${requisitionId}`,
            `<p>Dear Mr/Ms ${approverLv2?.name},</p>
            <p>A new Spare Part Requisition (No: ${requisitionId}) has been submitted for your approval.</br>
            You can find all the details about this request by clicking <a href="${config.client.url}/m/013/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</br>
            Please confirm your approval.</p>`
          );
          break;
        case 'Approved':
          await sendEmail(
            `${creator?.name} <${creator?.email}>` || '',
            [cc],
            [],
            `Spare Part Requisition No ${requisitionId} has been Approved`,
            `<p>Dear Mr/Ms ${creator?.name},</p>
            <p>Spare Part Requisition No: ${requisitionId} has been approved and Material Requisition No ${orderNo} has been created in IFS Applications.</br>
            You can find all the details by clicking <a href="${config.client.url}/m/013/sp-requisitions/add?requisitionId=${requisitionId}"><b>here</b></a>.</p>`
          );
          break;
        case 'Rejected':
          await sendEmail(
            `${creator?.name} <${creator?.email}>` || '',
            [],
            [],
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
