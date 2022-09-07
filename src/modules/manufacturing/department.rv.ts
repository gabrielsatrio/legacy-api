import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { DepartmentView } from './entities/department.vw';

@Resolver(DepartmentView)
export class DepartmentResolver {
  @Query(() => [DepartmentView])
  @UseMiddleware(isAuth)
  async getAllDepartments(): Promise<DepartmentView[] | undefined> {
    try {
      return await DepartmentView.find({ order: { departmentId: 'ASC' } });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => DepartmentView, { nullable: true })
  @UseMiddleware(isAuth)
  async getDepartment(
    @Arg('departmentId') departmentId: string
  ): Promise<DepartmentView | null> {
    try {
      return await DepartmentView.findOneBy({ departmentId });
    } catch (err) {
      throw new Error(mapError(err));
    }
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
      return await ifs.query(sql, [contract]);
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
