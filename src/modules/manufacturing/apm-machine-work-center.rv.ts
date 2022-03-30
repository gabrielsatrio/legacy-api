import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { MachineWorkCenter } from './entities/apm-machine-work-center';
import { MachWorkCenter } from './entities/apm-machine-work-center.vt';
import { MachineWorkCenterView } from './entities/apm-machine-work-center.vw';

@Resolver(MachineWorkCenter)
export class MachineWorkCenterResolver {
  @Query(() => [MachineWorkCenterView])
  @UseMiddleware(isAuth)
  async getMachineWorkCentersByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineWorkCenterView[] | undefined> {
    return await MachineWorkCenterView.find({
      where: {
        contract: In(contract),
        status: 'Active'
      }
    });
  }

  @Query(() => MachineWorkCenterView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachineWorkCenter(
    @Arg('workCenterNo') workCenterNo: string,
    @Arg('contract') contract: string
  ): Promise<MachineWorkCenterView | undefined> {
    return await MachineWorkCenterView.findOne({
      workCenterNo,
      contract,
      status: 'Active'
    });
  }

  @Query(() => MachineWorkCenterView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachineWorkCenterByDepartmentId(
    @Arg('contract') contract: string,
    @Arg('departmentId') departmentId: string
  ): Promise<MachineWorkCenterView | undefined> {
    try {
      const sql = `
        SELECT   work_center_no AS "workCenterNo",
                 contract     AS "contract",
                 description  AS "description",
                 status       AS "status",
                 created_at   AS "createdAt",
                 updated_at   AS "updatedAt",
                 ROWID        AS "objId"
        FROM     rob_apm_mach_work_center
        WHERE    contract = :contract
        AND      work_center_api.get_department_no(contract, work_center_no) = :departmentid
        and      status = 'Active'
        ORDER BY work_center_no
    `;
      const results = await getConnection().query(sql, [
        contract,
        departmentId
      ]);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineWorkCenterView])
  @UseMiddleware(isAuth)
  async getUnassignedWorkCentersByContractDeptId(
    @Arg('contract') contract: string,
    @Arg('departmentId') departmentId: string
  ): Promise<MachineWorkCenterView[] | undefined> {
    try {
      const sql = `
        SELECT   work_center_no AS "workCenterNo",
                 contract       AS "contract",
                 description    AS "description",
                 status         AS "status",
                 created_at     AS "createdAt",
                 updated_at     AS "updatedAt",
                 ROWID          AS "objId"
        FROM     ROB_APM_MACH_WORK_CENTER ramwc
        WHERE    ramwc.contract = :contract
        AND      ramwc.status = 'Active'
        AND      work_center_api.get_department_no(ramwc.contract, ramwc.work_center_no) = :departmentid
        AND      (ramwc.contract, ramwc.work_center_no) NOT IN (SELECT ram.contract,
                                                                       ram.work_center_no
                                                                FROM   rob_apm_machine ram
                                                                WHERE  ram.contract = ramwc.contract
                                                                AND    ram.work_center_no IS NOT NULL)
        ORDER BY ramwc.work_center_no
    `;
      const results = await getConnection().query(sql, [
        contract,
        departmentId
      ]);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachWorkCenter])
  @UseMiddleware(isAuth)
  async getAssignedMachWcByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachWorkCenter[] | undefined> {
    try {
      let sql = `
        SELECT   ramwc.work_center_no AS "workCenterNo",
                 ramwc.contract       AS "contract",
                 ramwc.description    AS "description",
                 ramwc.status         AS "status",
                 ram.machine_id       AS "machineId",
                 ram.description      AS "machineDescription",
                 ramwc.created_at     AS "createdAt",
                 ramwc.updated_at     AS "updatedAt",
                 ramwc.ROWID          AS "objId"
        FROM     rob_apm_mach_work_center ramwc,
                 rob_apm_machine          ram
        WHERE    ram.contract = ramwc.contract
        AND      ramwc.status = 'Active'
        AND      ram.work_center_no = ramwc.work_center_no
      `;
      let formattedContract = '';
      contract.map((item, index) => {
        formattedContract = `${formattedContract}${
          index > 0 ? ',' : ''
        } '${item}'`;
      });
      formattedContract.slice(0, formattedContract.length - 1);
      sql = `${sql}  AND      ramwc.contract IN (${formattedContract} )`;
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

  @Query(() => [MachineWorkCenterView])
  @UseMiddleware(isAuth)
  async getAvailMachWorkCentersByContractDeptId(
    @Arg('contract') contract: string,
    @Arg('departmentId') departmentId: string
  ): Promise<MachineWorkCenterView[] | undefined> {
    let formattedWorkCenters = '';
    try {
      const sqlToGetUnavailbleWC = `
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
      const unavailableWC = await getConnection().query(sqlToGetUnavailbleWC, [
        contract
      ]);
      let sql = `
        SELECT   work_center_no AS "workCenterNo",
                 contract     AS "contract",
                 description  AS "description",
                 status       AS "status",
                 created_at   AS "createdAt",
                 updated_at   AS "updatedAt",
                 ROWID        AS "objId"
        FROM     rob_apm_mach_work_center
        WHERE    contract = :contract
        AND      status = 'Active'
        AND      work_center_api.get_department_no(contract, work_center_no) = :departmentId
      `;
      unavailableWC.map((item: any, index: number) => {
        formattedWorkCenters = `${formattedWorkCenters}${
          index > 0 ? ',' : ''
        } '${item.workCenterNo}'`;
      });
      formattedWorkCenters.slice(0, formattedWorkCenters.length - 1);
      sql = `${sql}  AND      work_center_no NOT IN (${formattedWorkCenters} )`;
      const results = await getConnection().query(sql, [
        contract,
        departmentId
      ]);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachineWorkCenterView])
  @UseMiddleware(isAuth)
  async getAvailMachWcForHeadLoomByContract(
    @Arg('contract') contract: string,
    @Arg('departmentId', () => [String]) departmentId: string[],
    @Arg('categoryId', () => [String]) categoryId: string[]
  ): Promise<MachineWorkCenterView[] | undefined> {
    let formattedDepartmentId = '';
    let formattedCategoryId = '';
    try {
      let sql = `
        SELECT work_center_no AS "workCenterNo",
               contract       AS "contract",
               description    AS "description",
               status         AS "status",
               created_at     AS "createdAt",
               updated_at     AS "updatedAt",
               ROWID          AS "objId"
        FROM   rob_apm_mach_work_center ramwc
        WHERE  ramwc.contract = :contract
        AND    ramwc.status = 'Active'
        AND    (ramwc.contract, ramwc.work_center_no) IN
                (SELECT ram.contract,
                        ram.work_center_no
                 FROM   rob_apm_machine ram
                 WHERE  ram.contract = ramwc.contract
                 AND    work_center_api.get_department_no(ram.contract, ram.work_center_no) IN
                          ('TN1', 'TN2')
                 AND    ram.category_id NOT IN ('HD', 'HJ'))
        ORDER BY ramwc.work_center_no
    `;
      departmentId.map((item, index) => {
        formattedDepartmentId = `${formattedDepartmentId}${
          index > 0 ? ',' : ''
        } '${item}'`;
      });
      formattedDepartmentId.slice(0, formattedDepartmentId.length - 1);
      sql = `${sql}  AND      work_center_api.get_department_no(ram.contract,ram.work_center_no) IN (${formattedDepartmentId} )`;
      categoryId.map((item, index) => {
        formattedCategoryId = `${formattedCategoryId}${
          index > 0 ? ',' : ''
        } '${item}'`;
      });
      formattedCategoryId.slice(0, formattedCategoryId.length - 1);
      sql = `${sql}  AND      ram.category_id NOT IN (${formattedCategoryId} )`;
      const results = await getConnection().query(sql, [contract]);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MachWorkCenter])
  @UseMiddleware(isAuth)
  async getAvailMachWcForServicePrMap(
    @Arg('contract') contract: string,
    @Arg('requisitionNo') requisitionNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('releaseNo') releaseNo: string
  ): Promise<MachWorkCenter[] | undefined> {
    try {
      const sql = `
        SELECT   ramwc.work_center_no AS "workCenterNo",
                 ramwc.contract       AS "contract",
                 ramwc.description    AS "description",
                 ramwc.status         AS "status",
                 ram.machine_id       AS "machineId",
                 ram.description      AS "machineDescription",
                 ramwc.created_at     AS "createdAt",
                 ramwc.updated_at     AS "updatedAt",
                 ramwc.ROWID          AS "objId"
        FROM     rob_apm_mach_work_center ramwc,
                 rob_apm_machine          ram
        WHERE    ram.contract = ramwc.contract
        AND      ram.work_center_no = ramwc.work_center_no
        AND      ramwc.contract = :contract
        AND      ramwc.status = 'Active'
        AND      (ramwc.contract, ramwc.work_center_no) NOT IN
                  (SELECT ramt.contract,
                          rob_apm_machine_api.get_work_center_no(ramt.machine_id, ramt.contract)
                          AS work_center_no
                   FROM   rob_apm_maintenance ramt
                   WHERE  ramt.contract = ramwc.contract
                   AND    ramt.pr_no = :requisition_no
                   AND    ramt.pr_line_no = :line_no
                   AND    ramt.pr_release_no = :release_no)
        ORDER BY ramwc.work_center_no
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
