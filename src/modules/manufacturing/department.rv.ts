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
        SELECT   department_id AS "departmentId",
                 description   AS "description"
        FROM     atj_prod_department_v
        WHERE    contract = :contract
      `;
      const results = await getConnection().query(sql, [contract]);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
