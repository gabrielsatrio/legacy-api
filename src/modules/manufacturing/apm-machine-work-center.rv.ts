import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In, Like } from 'typeorm';
import { MachineMaintenanceView } from './entities/apm-machine-maintenance.vw';
import { MachineWorkCenter } from './entities/apm-machine-work-center.vt';
import { IfsWorkCenterView } from './entities/ifs-work-center.vw';
import { WorkCenterView } from './entities/work-center.vw';

@Resolver()
export class MachineWorkCenterResolver {
  @Query(() => [WorkCenterView])
  @UseMiddleware(isAuth)
  async getAvailWCForMachinesByContractDept(
    @Arg('contract') contract: string,
    @Arg('departmentNo') departmentNo: string
  ): Promise<WorkCenterView[] | undefined> {
    try {
      let sql = '';
      if (contract === 'AGT') {
        sql = `
          SELECT   work_center_no  AS "workCenterNo",
                   contract        AS "contract",
                   description     AS "description",
                   department_no   AS "departmentNo",
                   objid           AS "objId"
          FROM     work_center@ifs8agt
          WHERE    contract = :contract
          AND      department_no = :departmentNo
          AND      (contract, work_center_no) NOT IN (
                    SELECT   contract,
                             work_center_no AS "workCenterNo"
                    FROM     rob_apm_unavailable_wc_v
                    WHERE    contract = :contract
                   )
        `;
      } else {
        sql = `
          SELECT   work_center_no  AS "workCenterNo",
                   contract        AS "contract",
                   description     AS "description",
                   department_no   AS "departmentNo",
                   objid           AS "objId"
          FROM     work_center
          WHERE    contract = :contract
          AND      department_no = :departmentNo
          AND      (contract, work_center_no) NOT IN (
                    SELECT   contract,
                             work_center_no AS "workCenterNo"
                    FROM     rob_apm_unavailable_wc_v
                    WHERE    contract = :contract
                   )
        `;
      }
      const result = await ifs.query(sql, [contract, departmentNo]);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [IfsWorkCenterView])
  @UseMiddleware(isAuth)
  async getAssignedMachWcByContractDept(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('departmentNo', { defaultValue: '%', nullable: true })
    departmentNo: string
  ): Promise<IfsWorkCenterView[] | undefined> {
    try {
      const results = await WorkCenterView.find({
        relations: { machines: true },
        select: {
          workCenterNo: true,
          contract: true,
          description: true
        },
        where: { contract: In(contract), departmentNo: Like(departmentNo) },
        order: { workCenterNo: 'ASC' }
      });
      const filteredResults = results.filter((data) => data?.machines !== null);
      return filteredResults;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineWorkCenter])
  @UseMiddleware(isAuth)
  async getAvailMachWcForServicePrMap(
    @Arg('contract') contract: string,
    @Arg('requisitionNo') requisitionNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('releaseNo') releaseNo: string
  ): Promise<MachineWorkCenter[] | undefined> {
    try {
      const unavailableWC = await MachineMaintenanceView.find({
        select: { workCenterNo: true },
        where: {
          contract,
          prNo: requisitionNo,
          prLineNo: lineNo,
          prReleaseNo: releaseNo
        }
      });
      const unavailableWCArray = unavailableWC.map((data) => data.workCenterNo);
      let sql = '';
      if (contract === 'AGT') {
        sql = `
          SELECT   wc.work_center_no AS "workCenterNo",
                   wc.contract       AS "contract",
                   wc.description    AS "description",
                   wc.department_no  AS "departmentNo",
                   ram.machine_id    AS "machineId",
                   ram.description   AS "machineDescription",
                   wc.objid          AS "objId"
          FROM     work_center@ifs8agt wc,
                   rob_apm_machine     ram
          WHERE    ram.contract = wc.contract
          AND      ram.work_center_no = wc.work_center_no
          AND      wc.contract = :contract
        `;
      } else {
        sql = `
          SELECT   wc.work_center_no AS "workCenterNo",
                   wc.contract       AS "contract",
                   wc.description    AS "description",
                   wc.department_no  AS "departmentNo",
                   ram.machine_id    AS "machineId",
                   ram.description   AS "machineDescription",
                   wc.objid          AS "objId"
          FROM     work_center       wc,
                   rob_apm_machine   ram
          WHERE    ram.contract = wc.contract
          AND      ram.work_center_no = wc.work_center_no
          AND      wc.contract = :contract
        `;
      }
      const result = await ifs.query(sql, [contract]);
      const excludedMachCategory = ['HD', 'HJ'];
      let filteredResults = result.filter(
        (data: MachineWorkCenter) =>
          !unavailableWCArray.includes(data.workCenterNo) &&
          !excludedMachCategory.includes(data.machineId.substring(0, 2))
      );
      if (filteredResults) {
        filteredResults = filteredResults
          .slice()
          .sort((a: Record<string, any>, b: Record<string, any>) =>
            a.description > b.description ? 1 : -1
          );
      }
      return filteredResults;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
