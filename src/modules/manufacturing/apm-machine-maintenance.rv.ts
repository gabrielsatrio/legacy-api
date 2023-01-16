import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { MachineMaintenanceSyncInput } from './apm-machine-maintenance-sync.in';
import { MachineMaintenanceInput } from './apm-machine-maintenance.in';
import { MachineMaintenance } from './entities/apm-machine-maintenance';
import { MachineMaintenanceAgtView } from './entities/apm-machine-maintenance-agt.vw';
import { MachineMaintenanceView } from './entities/apm-machine-maintenance.vw';

@Resolver(MachineMaintenance)
export class MachineMaintenanceResolver {
  @Query(() => [MachineMaintenanceView])
  @UseMiddleware(isAuth)
  async getMachMaintenanceByMr(
    @Arg('contract') contract: string,
    @Arg('machineId') machineId: string,
    @Arg('orderNo') orderNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('releaseNo') releaseNo: string,
    @Arg('lineItemNo', () => Int) lineItemNo: number,
    @Arg('orderClass') orderClass: string
  ): Promise<MachineMaintenanceView[] | undefined> {
    try {
      if (contract === 'AGT') {
        return await MachineMaintenanceAgtView.find({
          where: {
            contract,
            machineId,
            mrNo: orderNo,
            mrLineNo: lineNo,
            mrReleaseNo: releaseNo,
            mrLineItemNo: lineItemNo,
            mrOrderClass: orderClass
          },
          order: { maintenanceId: 'ASC' }
        });
      }
      return await MachineMaintenanceView.find({
        where: {
          contract,
          machineId,
          mrNo: orderNo,
          mrLineNo: lineNo,
          mrReleaseNo: releaseNo,
          mrLineItemNo: lineItemNo,
          mrOrderClass: orderClass
        },
        order: { maintenanceId: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineMaintenanceView])
  @UseMiddleware(isAuth)
  async getMachMaintenanceByPr(
    @Arg('requisitionNo') requisitionNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('releaseNo') releaseNo: string
  ): Promise<MachineMaintenanceView[] | undefined> {
    try {
      const data = await MachineMaintenance.findBy({
        prNo: requisitionNo,
        prLineNo: lineNo,
        prReleaseNo: releaseNo
      });
      if (data.length > 0 && data[0].contract === 'AGT') {
        return await MachineMaintenanceAgtView.findBy({
          prNo: requisitionNo,
          prLineNo: lineNo,
          prReleaseNo: releaseNo
        });
      }
      return await MachineMaintenanceView.findBy({
        prNo: requisitionNo,
        prLineNo: lineNo,
        prReleaseNo: releaseNo
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineMaintenanceView])
  @UseMiddleware(isAuth)
  async getMachMaintenanceForSNPByMachineId(
    @Arg('contract') contract: string,
    @Arg('machineId') machineId: string
  ): Promise<MachineMaintenanceView[] | undefined> {
    try {
      if (contract === 'AGT') {
        return await MachineMaintenanceAgtView.find({
          where: { contract, machineId, categoryId: 'SNP' },
          order: { maintenanceId: 'ASC' }
        });
      }
      return await MachineMaintenanceView.find({
        where: { contract, machineId, categoryId: 'SNP' },
        order: { maintenanceId: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineMaintenanceView)
  @UseMiddleware(isAuth)
  async createMachMaintenance(
    @Arg('input') input: MachineMaintenanceInput
  ): Promise<MachineMaintenanceView | null> {
    try {
      const sql = `SELECT ROB_APM_Maintenance_API.Get_New_Id() AS "newId" FROM DUAL`;
      const res = await ifs.query(sql);
      const data = MachineMaintenance.create({
        ...input,
        maintenanceId: res[0].newId
      });
      await MachineMaintenance.save(data);
      if (input.contract === 'AGT') {
        return await MachineMaintenanceAgtView.findOneBy({
          maintenanceId: res[0].newId
        });
      }
      return await MachineMaintenanceView.findOneBy({
        maintenanceId: res[0].newId
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineMaintenanceView, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMachMaintenance(
    @Arg('maintenanceId', () => Int) maintenanceId: number,
    @Arg('input') input: MachineMaintenanceInput
  ): Promise<MachineMaintenanceView | null> {
    try {
      const data = await MachineMaintenance.findOneBy({ maintenanceId });
      if (!data) throw new Error('No data found.');
      MachineMaintenance.merge(data, { ...input });
      const response = await MachineMaintenance.save(data);
      if (input.contract === 'AGT') {
        return await MachineMaintenanceAgtView.findOneBy({
          maintenanceId: response.maintenanceId
        });
      }
      return await MachineMaintenanceView.findOneBy({
        maintenanceId: response.maintenanceId
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineMaintenanceView)
  @UseMiddleware(isAuth)
  async deleteMachMaintenance(
    @Arg('maintenanceId', () => Int) maintenanceId: number
  ): Promise<MachineMaintenanceView | null> {
    try {
      let data;
      data = await MachineMaintenance.findOneBy({ maintenanceId });
      if (!data) throw new Error('No data found.');
      if (data?.contract === 'AGT') {
        data = await MachineMaintenanceAgtView.findOneBy({ maintenanceId });
      } else {
        data = await MachineMaintenanceView.findOneBy({ maintenanceId });
      }
      await MachineMaintenance.delete({ maintenanceId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineMaintenanceView)
  @UseMiddleware(isAuth)
  async deleteMachMaintenanceByMR(
    @Arg('contract') contract: string,
    @Arg('machineId') machineId: string,
    @Arg('mrNo') mrNo: string,
    @Arg('mrLineNo') mrLineNo: string,
    @Arg('mrReleaseNo') mrReleaseNo: string,
    @Arg('mrLineItemNo', () => Int) mrLineItemNo: number,
    @Arg('mrOrderClass') mrOrderClass: string
  ): Promise<MachineMaintenanceView | null> {
    try {
      let data;
      data = await MachineMaintenance.findOneBy({
        contract,
        machineId,
        mrNo,
        mrLineNo,
        mrReleaseNo,
        mrLineItemNo,
        mrOrderClass
      });
      if (!data) throw new Error('No data found.');
      if (data?.contract === 'AGT') {
        data = await MachineMaintenanceAgtView.findOneBy({
          contract,
          machineId,
          mrNo,
          mrLineNo,
          mrReleaseNo,
          mrLineItemNo,
          mrOrderClass
        });
      } else {
        data = await MachineMaintenanceView.findOneBy({
          contract,
          machineId,
          mrNo,
          mrLineNo,
          mrReleaseNo,
          mrLineItemNo,
          mrOrderClass
        });
      }
      await MachineMaintenance.delete({
        contract,
        machineId,
        mrNo,
        mrLineNo,
        mrReleaseNo,
        mrLineItemNo,
        mrOrderClass
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineMaintenanceView)
  @UseMiddleware(isAuth)
  async syncMachMaintenanceForMr(
    @Arg('input') input: MachineMaintenanceSyncInput
  ): Promise<MachineMaintenanceView | null> {
    try {
      const sql = `
        BEGIN
          ROB_APM_Maintenance_API.Sync__(
            :contract,
            :machineId,
            :maintenanceDate,
            :categoryId,
            :description,
            :quantity,
            :duration,
            :performedBy,
            :mrNo,
            :mrLineNo,
            :mrReleaseNo,
            :mrLineItemNo,
            :orderClass,
            :prNo,
            :prLineNo,
            :prReleaseNo,
            :newMachineId,
            :newQuantity,
            :outMaintenanceId
          );
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      const res = await ifs.query(sql, [
        input.contract,
        input.machineId,
        input.maintenanceDate,
        input.categoryId,
        input.description,
        input.quantity,
        input.duration,
        input.performedBy,
        input.mrNo,
        input.mrLineNo,
        input.mrReleaseNo,
        input.mrLineItemNo,
        input.mrOrderClass,
        input.prNo,
        input.prLineNo,
        input.prReleaseNo,
        input.newMachineId,
        input.newQuantity,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      if (input.contract === 'AGT') {
        return await MachineMaintenanceAgtView.findOneBy({
          maintenanceId: res[0] as number
        });
      }
      return await MachineMaintenanceView.findOneBy({
        maintenanceId: res[0] as number
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
