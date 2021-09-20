import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { AssignDetail } from './entities/spt-assign-detail';
import { AssignDetailInput } from './spt-assign-detail.in';

@Resolver(AssignDetail)
export class AssignDetailResolver {
  @Query(() => [AssignDetail])
  @UseMiddleware(isAuth)
  async getAllAssignDetail(): Promise<AssignDetail[] | undefined> {
    return AssignDetail.find();
  }

  @Query(() => AssignDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async getAssignDetail(
    @Arg('assignId') assignId: string,
    @Arg('reqNo') reqNo: string
  ): Promise<AssignDetail | undefined> {
    return await AssignDetail.findOne({
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
    //@Arg('assignDate') assignDate: Date
  ): Promise<any | undefined> {
    //const sql = `SELECT MAX(assign_id) as assign_id FROM GBR_SPT_ASSIGN_TAB where tipe = :tipe and assign_date = :assignDate`;
    return await AssignDetail.findOne({
      assignId: assignId,
      assignDate: assignDate,
      reqNo: reqNo,
      requisitionDate: requisitionDate
    });
  }

  @Query(() => AssignDetail, { nullable: true })
  @UseMiddleware(isAuth)
  async getTarif(
    @Arg('reqNo') reqNo: string,
    @Arg('expeditionId') expeditionId: string,
    @Arg('vehicleId') vehicleId: string,
    @Arg('isNormalPrice') isNormalPrice: string
    //@Arg('assignDate') assignDate: Date
  ): Promise<any | undefined> {
    let totalPrice;
    //const sql = `SELECT MAX(assign_id) as assign_id FROM GBR_SPT_ASSIGN_TAB where tipe = :tipe and assign_date = :assignDate`;
    const sql = `SELECT GBR_SPT_API.CALCULATE_TARIF(:reqNo, :expeditionId, :vehicleId, :isNormalPrice) as TOTAL_PRICE from dual`;
    try {
      totalPrice = await getConnection().query(sql, [
        reqNo,
        expeditionId,
        vehicleId,
        isNormalPrice
      ]);
      totalPrice = totalPrice[0].TOTAL_PRICE;
      console.log('totalPrice', totalPrice);
    } catch (err) {
      throw new Error(mapError(err));
    }
    //return assignId;
    return { totalPrice: totalPrice };
    //return Assign.create(assignId);
  }

  @Mutation(() => AssignDetail)
  @UseMiddleware(isAuth)
  async createAssignDetail(
    @Arg('input') input: AssignDetailInput
    //@Ctx() { req }: Context
  ): Promise<AssignDetail | undefined> {
    let result;
    //const createdBy: string = req.session.userId;
    const sql = `
      BEGIN
        GBR_SPT_API.Create_Assign_Detail(:assignId, :assignDate, :reqNo, :requisitionDate, :outAssignId, :outReqNo, :outAssignDate, :outRequisitionDate);
      END;
    `;
    try {
      result = await getConnection().query(sql, [
        input.assignId,
        input.assignDate,
        input.reqNo,
        input.requisitionDate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        { dir: oracledb.BIND_OUT, type: oracledb.DATE }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    console.log('result create assign detail', result);
    const outAssignId = result[0] as string;
    const outReqNo = result[1] as string;
    const outAssignDate = result[2] as Date;
    const outRequisitionDate = result[3] as Date;
    const data = AssignDetail.findOne({
      assignId: outAssignId,
      reqNo: outReqNo,
      assignDate: outAssignDate,
      requisitionDate: outRequisitionDate
    });

    return data;
  }

  @Mutation(() => AssignDetail)
  @UseMiddleware(isAuth)
  async updateAssignDetail(
    @Arg('input') input: AssignDetailInput
    //@Ctx() { req }: Context
  ): Promise<AssignDetail | undefined> {
    let result;
    //const createdBy: string = req.session.userId;
    const sql = `
      BEGIN
        GBR_SPT_API.UPDATE_ASSIGN_DETAIL(:assignId, :assignDate, :reqNo, :requisitionDate,
          :expeditionId, :vehicleId, :licensePlate, :driverName, :nomorResi, :isNormalPrice,
          :totalPrice, :nopolLangsir, :ppn, :price, :outAssignId, :outReqNo, :outAssignDate, :outRequisitionDate);
      END;
    `;
    try {
      result = await getConnection().query(sql, [
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
    } catch (err) {
      throw new Error(mapError(err));
    }
    console.log('input', input);

    const outAssignId = result[0] as string;
    const outAssignDate = result[1] as Date;
    const outReqNo = result[2] as string;
    const outRequisitionDate = result[3] as Date;
    console.log('outAssignId', outAssignId);
    console.log('outAssignDate', outAssignDate);
    console.log('outReqNo', outReqNo);
    console.log('outRequisitionDate', outRequisitionDate);
    const data = AssignDetail.findOne({
      assignId: outAssignId,
      assignDate: outAssignDate,
      reqNo: outReqNo,
      requisitionDate: outRequisitionDate
    });
    return data;
  }

  // @Mutation(() => AssignDetail)
  // @UseMiddleware(isAuth)
  // async deleteAssignDetail(
  //   @Arg('assignId') assignId: string,
  //   @Arg('assignDate') assignDate: Date,
  //   @Arg('reqNo') reqNo: number,
  //   @Arg('requisitionDate') requisitionDate: Date
  //   //@Ctx() { req }: Context
  // ): Promise<AssignDetail> {
  //   //const createdBy: string = req.session.userId;
  //   const assignDetail = await AssignDetail.findOne({
  //     assignId: assignId,
  //     assignDate: assignDate,
  //     reqNo: reqNo,
  //     requisitionDate: requisitionDate
  //   });

  //   if (!assignDetail) throw new Error('No data found.');
  //   try {
  //     await AssignDetail.delete({
  //       assignId: assignId,
  //       assignDate: assignDate,
  //       reqNo: reqNo,
  //       requisitionDate: requisitionDate
  //     });
  //     return assignDetail;
  //   } catch (err) {
  //     throw new Error(mapError(err));
  //   }
  // }

  @Mutation(() => AssignDetail)
  @UseMiddleware(isAuth)
  async deleteAssignDetail(
    @Arg('input') input: AssignDetailInput
    //@Ctx() { req }: Context
  ): Promise<AssignDetail | undefined> {
    //const createdBy: string = req.session.userId;
    const sql = `
      BEGIN
        GBR_SPT_API.Delete_Assign_Detail(:assignId, :assignDate, :reqNo, :requisitionDate, :outAssignId, :outReqNo, :outAssignDate, :outRequisitionDate);
      END;
    `;
    try {
      console.log('delete input', input);
      const data = await AssignDetail.findOne({
        assignId: input.assignId,
        reqNo: input.reqNo,
        assignDate: input.assignDate,
        requisitionDate: input.requisitionDate
      });

      if (!data) throw new Error('No data found.');
      await getConnection().query(sql, [
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
