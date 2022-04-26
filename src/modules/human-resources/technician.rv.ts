import { isAuth } from '@/middlewares/is-auth';
import { EmployeeView } from '@/modules/human-resources/entities/org-employee.vw';
import { customEmail } from '@/utils/custom-email';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';

@Resolver()
export class TechnicianResolver {
  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getTechnicians(
    @Arg('workLocation') workLocation: string
  ): Promise<EmployeeView[]> {
    const employees = await EmployeeView.find({
      where: { workLocation },
      order: { name: 'ASC' }
    });
    employees.map((employee) => (employee.email = customEmail(employee.email)));
    return employees;
  }
}
