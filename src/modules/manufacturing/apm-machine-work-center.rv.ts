import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { MachineWorkCenter } from '@/types/graphql/machine-work-center';
import { mapError } from '@/utils/map-error';
import { toCsvWithQuotes } from '@/utils/to-csv-with-quotes';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
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
        SELECT  work_center_no                                                      AS "workCenterNo",
                contract                                                            AS "contract",
                TRIM(NVL(work_center_api.get_description(contract, work_center_no),
                work_center_api.get_description@ifs8agt(contract, work_center_no))) AS "description",
                department_id                                                       AS "departmentNo",
                machine_id                                                          AS "machineId",
                description                                                         AS "machineDescription",
                rowid                                                               AS "objId"
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
              a.description.localeCompare(b.description) ||
              a.machineId.localeCompare(b.machineId)
          );
      }
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
