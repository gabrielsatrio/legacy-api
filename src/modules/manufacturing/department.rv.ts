import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { DepartmentView } from './entities/department.vw';

@Resolver(DepartmentView)
export class DepartmentResolver {
  @Query(() => [DepartmentView])
  @UseMiddleware(isAuth)
  async getAllDepartments(): Promise<DepartmentView[] | undefined> {
    return await DepartmentView.find({ order: { departmentId: 'ASC' } });
  }

  @Query(() => DepartmentView)
  @UseMiddleware(isAuth)
  async getDepartment(
    @Arg('departmentId') departmentId: string
  ): Promise<DepartmentView | undefined> {
    return await DepartmentView.findOne({ departmentId });
  }

  @Query(() => [DepartmentView])
  @UseMiddleware(isAuth)
  async getProdWCDeptsByContract(
    @Arg('contract') contract: string
  ): Promise<DepartmentView[] | undefined> {
    try {
      const sql = `
        SELECT   DISTINCT d.department_id AS "departmentId",
                 d.description AS "description"
        FROM     atj_department_v d,
                 work_center    wc
        WHERE    wc.department_no = d.department_id
        AND      wc.contract = :contract
        AND      wc.contract != 'AGT'
        UNION
        SELECT   DISTINCT d.department_id AS "departmentId",
                 d.description AS "description"
        FROM     atj_department_v@ifs8agt d,
                 work_center@ifs8agt    wc
        WHERE    wc.department_no = d.department_id
        AND      wc.contract = :contract
        AND      wc.contract = 'AGT'
        ORDER BY 1
      `;
      const results = await getConnection().query(sql, [contract]);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
