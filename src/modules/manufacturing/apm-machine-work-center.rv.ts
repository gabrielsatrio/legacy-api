import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { MachineMaintenanceView } from './entities/apm-machine-maintenance.vw';
import { MachineWorkCenter } from './entities/apm-machine-work-center.vt';
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
      const results = await getConnection().query(sql, [
        contract,
        departmentNo
      ]);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineWorkCenter])
  @UseMiddleware(isAuth)
  async getAssignedMachWcByContractDept(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('departmentNo', { nullable: true }) departmentNo: string
  ): Promise<MachineWorkCenter[] | undefined> {
    try {
      let sql = '';
      let formattedContract = '';
      if (contract[0] === 'AGT') {
        sql = `
          SELECT   wc.work_center_no AS "workCenterNo",
                   wc.contract       AS "contract",
                   wc.description    AS "description",
                   wc.department_no  AS "departmentNo",
                   ram.machine_id    AS "machineId",
                   ram.description   AS "machineDescription",
                   wc.objid          AS "objId"
          FROM     work_center@ifs8agt  wc,
                   rob_apm_machine      ram
          WHERE    ram.contract = wc.contract
          AND      ram.work_center_no = wc.work_center_no
          AND      wc.department_no LIKE :departmentNo
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
          AND      wc.department_no LIKE :departmentNo
        `;
      }
      contract.map((item, index) => {
        formattedContract = `${formattedContract}${
          index > 0 ? ',' : ''
        } '${item}'`;
      });
      formattedContract.slice(0, formattedContract.length - 1);
      sql = `${sql}  AND      wc.contract IN (${formattedContract} )`;
      let results = await getConnection().query(sql, [
        departmentNo ? departmentNo : '%'
      ]);
      if (results) {
        results = results
          .slice()
          .sort((a: Record<string, any>, b: Record<string, any>) =>
            a.description > b.description ? 1 : -1
          );
      }
      return results;
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
        select: ['workCenterNo'],
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
      const results = await getConnection().query(sql, [contract]);
      let filteredResults = results.filter(
        (data: MachineWorkCenter) =>
          !unavailableWCArray.includes(data.workCenterNo)
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
