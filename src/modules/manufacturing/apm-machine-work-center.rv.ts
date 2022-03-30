import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
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
    let formattedWorkCenters = '';
    try {
      const sqlToGetUnavailableWC = `
        SELECT   ram.contract AS "contract",
                 ram.work_center_no AS "workCenterNo",
                 COUNT(*) AS "quantity"
        FROM     rob_apm_machine ram
        WHERE    ram.contract = :contract
        AND      ram.contract != 'AGT'
        AND      work_center_api.get_department_no(ram.contract, ram.work_center_no) NOT IN ('TN1', 'TN2')
        AND      ram.work_center_no IS NOT NULL
        GROUP BY ram.contract, ram.work_center_no
        UNION
        SELECT   ram.contract AS "contract",
                 ram.work_center_no AS "workCenterNo",
                 COUNT(*) AS "quantity"
        FROM     rob_apm_machine ram
        WHERE    ram.contract = :contract
        AND      ram.contract != 'AGT'
        AND      work_center_api.get_department_no(ram.contract, ram.work_center_no) IN ('TN1', 'TN2')
        AND      ram.work_center_no IS NOT NULL
        GROUP BY ram.contract, ram.work_center_no
        HAVING   COUNT(*) >= 2
        UNION
        SELECT   ram.contract AS "contract",
                 ram.work_center_no AS "workCenterNo",
                 COUNT(*) AS "quantity"
        FROM     rob_apm_machine ram
        WHERE    ram.contract = :contract
        AND      'AGT' = :contract
        AND      work_center_api.get_department_no@ifs8agt(ram.contract, ram.work_center_no) NOT IN ('CTG')
        AND      ram.work_center_no IS NOT NULL
        GROUP BY ram.contract, ram.work_center_no
        UNION
        SELECT   ram.contract AS "contract",
                 ram.work_center_no AS "workCenterNo",
                 COUNT(*) AS "quantity"
        FROM     rob_apm_machine ram
        WHERE    ram.contract = :contract
        AND      'AGT' = :contract
        AND      work_center_api.get_department_no@ifs8agt(ram.contract, ram.work_center_no) NOT IN ('CTG')
        AND      ram.work_center_no IS NOT NULL
        GROUP BY ram.contract, ram.work_center_no
        HAVING   COUNT(*) >= 3
    `;
      const unavailableWC = await getConnection().query(sqlToGetUnavailableWC, [
        contract
      ]);
      let sql = `
        SELECT   work_center_no  AS "workCenterNo",
                 contract        AS "contract",
                 description     AS "description",
                 department_no   AS "departmentNo",
                 objId           AS "objId"
        FROM     atj_work_center_v
        WHERE    contract = :contract
        AND      department_no = :departmentNo
      `;
      unavailableWC.map((item: any, index: number) => {
        formattedWorkCenters = `${formattedWorkCenters}${
          index > 0 ? ',' : ''
        } '${item.workCenterNo}'`;
      });
      formattedWorkCenters.slice(0, formattedWorkCenters.length - 1);
      sql = `${sql}  AND      work_center_no NOT IN (${formattedWorkCenters} )`;
      sql = `${sql}  ORDER BY work_center_no`;
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
  async getAssignedMachWcByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineWorkCenter[] | undefined> {
    try {
      let sql = `
        SELECT   wc.work_center_no AS "workCenterNo",
                 wc.contract       AS "contract",
                 wc.description    AS "description",
                 department_no     AS "departmentNo",
                 ram.machine_id    AS "machineId",
                 ram.description   AS "machineDescription",
                 wc.objId          AS "objId"
        FROM     work_center       wc,
                 rob_apm_machine   ram
        WHERE    ram.contract = wc.contract
        AND      ram.work_center_no = wc.work_center_no
      `;
      let formattedContract = '';
      contract.map((item, index) => {
        formattedContract = `${formattedContract}${
          index > 0 ? ',' : ''
        } '${item}'`;
      });
      formattedContract.slice(0, formattedContract.length - 1);
      sql = `${sql}  AND      wc.contract IN (${formattedContract} )`;
      let results = await getConnection().query(sql);
      if (results) {
        results = results
          .slice()
          .sort((a: Record<string, any>, b: Record<string, any>) =>
            a.workCenterNo > b.workCenterNo ? 1 : -1
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
      const sql = `
        SELECT   wc.work_center_no AS "workCenterNo",
                 wc.contract       AS "contract",
                 wc.description    AS "description",
                 department_no     AS "departmentNo",
                 ram.machine_id    AS "machineId",
                 ram.description   AS "machineDescription",
                 wc.objId          AS "objId"
        FROM     atj_work_center_v  wc,
                 rob_apm_machine    ram
        WHERE    ram.contract = wc.contract
        AND      ram.work_center_no = wc.work_center_no
        AND      wc.contract = :contract
        AND      (wc.contract, wc.work_center_no) NOT IN
                  (SELECT ramt.contract,
                          rob_apm_machine_api.get_work_center_no(ramt.machine_id, ramt.contract)
                          AS work_center_no
                   FROM   rob_apm_maintenance ramt
                   WHERE  ramt.contract = wc.contract
                   AND    ramt.pr_no = :requisition_no
                   AND    ramt.pr_line_no = :line_no
                   AND    ramt.pr_release_no = :release_no)
        ORDER BY wc.work_center_no
    `;
      const results = await getConnection().query(sql, [
        contract,
        requisitionNo,
        lineNo,
        releaseNo
      ]);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
