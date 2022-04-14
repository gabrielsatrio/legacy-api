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
import { MachineMaintenanceView } from './entities/apm-machine-maintenance.vw';

@Resolver(MachineMaintenance)
export class MachineMaintenanceResolver {
  @Query(() => [MachineMaintenanceView])
  @UseMiddleware(isAuth)
  async getMachMaintenanceByPrNo(
    @Arg('requisitionNo') requisitionNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('releaseNo') releaseNo: string
  ): Promise<MachineMaintenanceView[] | undefined> {
    return await MachineMaintenanceView.findBy({
      prNo: requisitionNo,
      prLineNo: lineNo,
      prReleaseNo: releaseNo
    });
  }

  @Query(() => [MachineMaintenanceView])
  @UseMiddleware(isAuth)
  async getMachMaintenanceForSNPByMachineId(
    @Arg('contract') contract: string,
    @Arg('machineId') machineId: string
  ): Promise<MachineMaintenanceView[] | undefined> {
    return await MachineMaintenanceView.find({
      where: { contract, machineId, categoryId: 'SNP' },
      order: { maintenanceId: 'ASC' }
    });
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
      const result = await MachineMaintenanceView.findOneBy({
        maintenanceId: res[0].newId
      });
      return result;
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
      const result = await MachineMaintenanceView.findOneBy({
        maintenanceId: response.maintenanceId
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineMaintenanceView)
  @UseMiddleware(isAuth)
  async deleteMachMaintenance(
    @Arg('maintenanceId', () => Int) maintenanceId: number
  ): Promise<MachineMaintenanceView | undefined> {
    try {
      const data = await MachineMaintenanceView.findOneBy({ maintenanceId });
      if (!data) throw new Error('No data found.');
      await MachineMaintenance.delete({ maintenanceId });
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
      const result = await MachineMaintenanceView.findOneBy({
        maintenanceId: res[0] as number
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
