import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { toCsvWithQuotes } from '@/utils/to-csv-with-quotes';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
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
        `;
      }
      const result = await ifs.query(sql, [contract, departmentNo]);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineWorkCenter])
  @UseMiddleware(isAuth)
  async getAssignedMachWcByContractDept(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('departmentNo', { defaultValue: '%', nullable: true })
    departmentNo: string
  ): Promise<MachineWorkCenter[] | undefined> {
    try {
      const sql = `
        SELECT  work_center_no                                                AS "workCenterNo",
                contract                                                      AS "contract",
                contract AS "contract",
                CASE contract
                  WHEN 'AGT' THEN work_center_api.get_description@ifs8agt(contract, work_center_no)
                  ELSE work_center_api.get_description(contract, work_center_no)
                END                                                           AS "description",
                department_id                                                 AS "departmentNo",
                machine_id                                                    AS "machineId",
                description                                                   AS "machineDescription",
                rowid                                                         AS "objId"
        FROM    rob_apm_machine
        WHERE   contract IN (${toCsvWithQuotes(contract)})
        AND     department_id LIKE :departmentNo
        AND     work_center_no IS NOT NULL
      `;
      let result = await ifs.query(sql, [departmentNo]);
      if (result) {
        result = result
          .slice()
          .sort(
            (a: Record<string, any>, b: Record<string, any>) =>
              b.description - a.description ||
              a.machineId.localeCompare(b.machineId)
          );
      }
      return result;
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
