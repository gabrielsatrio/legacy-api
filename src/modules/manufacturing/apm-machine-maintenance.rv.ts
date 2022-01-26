import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
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
    return await MachineMaintenanceView.find({
      prNo: requisitionNo,
      prLineNo: lineNo,
      prReleaseNo: releaseNo
    });
  }

  @Mutation(() => MachineMaintenanceView)
  @UseMiddleware(isAuth)
  async createMachMaintenance(
    @Arg('input') input: MachineMaintenanceInput,
    @Ctx() { req }: Context
  ): Promise<MachineMaintenanceView | undefined> {
    try {
      const sql = `SELECT ROB_APM_Maintenance_API.Get_New_Id() AS "newId" FROM DUAL`;
      const res = await getConnection().query(sql);
      const data = MachineMaintenance.create({
        ...input,
        maintenanceId: res[0].newId,
        performedBy: req.session.username
      });
      await MachineMaintenance.save(data);
      const result = await MachineMaintenanceView.findOne({
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
    @Arg('input') input: MachineMaintenanceInput
  ): Promise<MachineMaintenanceView | undefined> {
    try {
      const data = await MachineMaintenance.findOne({
        maintenanceId: input.maintenanceId
      });
      if (!data) throw new Error('No data found.');
      MachineMaintenance.merge(data, input);
      const response = await MachineMaintenance.save(data);
      const result = await MachineMaintenanceView.findOne({
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
      const data = await MachineMaintenanceView.findOne({ maintenanceId });
      if (!data) throw new Error('No data found.');
      await MachineMaintenance.delete({ maintenanceId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
