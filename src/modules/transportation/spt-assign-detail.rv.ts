import { ifs } from '@/config/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { AssignDetail } from './entities/spt-assign-detail';
import { AssignDetailInput } from './spt-assign-detail.in';

@Resolver(AssignDetail)
export class AssignDetailResolver {
  @Query(() => [AssignDetail])
  @UseMiddleware(isAuth)
  async getAllAssignDetail(): Promise<AssignDetail[] | undefined> {
    return await AssignDetail.find();
  }

  @Query(() => AssignDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignDetail(
    @Arg('assignId') assignId: string,
    @Arg('reqNo') reqNo: string
  ): Promise<AssignDetail | null> {
    return await AssignDetail.findOneBy({
      assignId: assignId,
      reqNo: reqNo
    });
  }
  @Query(() => AssignDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignDetailById(
    @Arg('assignId') assignId: string,
    @Arg('assignDate') assignDate: Date,
    @Arg('reqNo') reqNo: string,
    @Arg('requisitionDate') requisitionDate: Date
  ): Promise<any | undefined> {
    return await AssignDetail.findOneBy({
      assignId,
      assignDate,
      reqNo,
      requisitionDate
    });
  }

  @Query(() => AssignDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async getTarif(
    @Arg('reqNo') reqNo: string,
    @Arg('expeditionId') expeditionId: string,
    @Arg('vehicleId') vehicleId: string,
    @Arg('isNormalPrice') isNormalPrice: string
  ): Promise<any | undefined> {
    try {
      const sql = `SELECT GBR_SPT_API.CALCULATE_TARIF(:reqNo, :expeditionId, :vehicleId, :isNormalPrice) as "totalPrice" from dual`;
      let totalPrice = await ifs.query(sql, [
        reqNo,
        expeditionId,
        vehicleId,
        isNormalPrice
      ]);
      totalPrice = totalPrice[0].totalPrice;
      return { totalPrice };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => AssignDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async getIsNormalPrice(
    @Arg('reqNo') reqNo: string,
    @Arg('expeditionId') expeditionId: string,
    @Arg('vehicleId') vehicleId: string
  ): Promise<any | undefined> {
    try {
      const sql = `SELECT GBR_SPT_API.IS_NORMAL_PRICE(:reqNo, :expeditionId, :vehicleId) as "isNormalPrice" from dual`;
      let isNormalPrice = await ifs.query(sql, [
        reqNo,
        expeditionId,
        vehicleId
      ]);
      isNormalPrice = isNormalPrice[0].isNormalPrice;
      return { isNormalPrice };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AssignDetail)
  @UseMiddleware(isAuth)
  async createAssignDetail(
    @Arg('input') input: AssignDetailInput
  ): Promise<AssignDetail | null> {
    try {
      const sql = `
      BEGIN
        GBR_SPT_API.Create_Assign_Detail(:assignId, :assignDate, :reqNo, :requisitionDate, :outAssignId, :outReqNo, :outAssignDate, :outRequisitionDate);
      END;
    `;
      const result = await ifs.query(sql, [
        input.assignId,
        input.assignDate,
        input.reqNo,
        input.requisitionDate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE }
      ]);
      const outAssignId = result[0] as string;
      const outReqNo = result[1] as string;
      const outAssignDate = result[2] as Date;
      const outRequisitionDate = result[3] as Date;
      const data = AssignDetail.findOneBy({
        assignId: outAssignId,
        reqNo: outReqNo,
        assignDate: outAssignDate,
        requisitionDate: outRequisitionDate
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AssignDetail)
  @UseMiddleware(isAuth)
  async createNewAssign(
    @Arg('input') input: AssignDetailInput,
    @Ctx() { req }: Context
  ): Promise<AssignDetail | null> {
    try {
      const createdBy: string = req.session.username;
      const sql = `
      BEGIN
        GBR_SPT_API.Create_NEW_ASSIGN(:assignId, :assignDate, :createdBy, :reqNo, :requisitionDate, :outAssignId, :outReqNo, :outAssignDate, :outRequisitionDate);
      END;
    `;
      const result = await ifs.query(sql, [
        input.assignId,
        input.assignDate,
        createdBy,
        input.reqNo,
        input.requisitionDate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE }
      ]);
      const outAssignId = result[0] as string;
      const outReqNo = result[1] as string;
      const outAssignDate = result[2] as Date;
      const outRequisitionDate = result[3] as Date;
      const data = AssignDetail.findOneBy({
        assignId: outAssignId,
        reqNo: outReqNo,
        assignDate: outAssignDate,
        requisitionDate: outRequisitionDate
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AssignDetail)
  @UseMiddleware(isAuth)
  async updateAssignDetail(
    @Arg('input') input: AssignDetailInput
  ): Promise<AssignDetail | null> {
    try {
      const sql = `
      BEGIN
        GBR_SPT_API.UPDATE_ASSIGN_DETAIL(:assignId, :assignDate, :reqNo, :requisitionDate,
          :expeditionId, :vehicleId, :licensePlate, :driverName, :nomorResi, :isNormalPrice,
          :totalPrice, :nopolLangsir, :ppn, :price, :outAssignId, :outReqNo, :outAssignDate, :outRequisitionDate);
      END;
    `;
      const result = await ifs.query(sql, [
        input.assignId,
        input.assignDate,
        input.reqNo,
        input.requisitionDate,
        input.expeditionId,
        input.vehicleId,
        input.licensePlate,
        input.driverName,
        input.nomorResi,
        input.isNormalPrice,
        input.totalPrice,
        input.nopolLangsir,
        input.ppn,
        input.price,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE }
      ]);
      const outAssignId = result[0] as string;
      const outAssignDate = result[1] as Date;
      const outReqNo = result[2] as string;
      const outRequisitionDate = result[3] as Date;
      const data = AssignDetail.findOneBy({
        assignId: outAssignId,
        assignDate: outAssignDate,
        reqNo: outReqNo,
        requisitionDate: outRequisitionDate
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AssignDetail)
  @UseMiddleware(isAuth)
  async deleteAssignDetail(
    @Arg('input') input: AssignDetailInput
  ): Promise<AssignDetail | undefined> {
    try {
      const sql = `
      BEGIN
        GBR_SPT_API.Delete_Assign_Detail(:assignId, :assignDate, :reqNo, :requisitionDate, :outAssignId, :outReqNo, :outAssignDate, :outRequisitionDate);
      END;
    `;
      const data = await AssignDetail.findOneBy({
        assignId: input.assignId,
        reqNo: input.reqNo,
        assignDate: input.assignDate
      });
      if (!data) throw new Error('No data found.');
      await ifs.query(sql, [
        input.assignId,
        input.assignDate,
        input.reqNo,
        input.requisitionDate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE }
      ]);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
