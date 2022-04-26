import { isAuth } from '@/middlewares/is-auth';
import { EmployeeView } from '@/modules/human-resources/entities/org-employee.vw';
import { customEmail } from '@/utils/custom-email';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { TechnicianView } from './entities/techinician.vw';

@Resolver()
export class TechnicianResolver {
  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getTechnicians(
    @Arg('workLocation') workLocation: string
  ): Promise<EmployeeView[]> {
    const tecnicians = await TechnicianView.find({
      where: { workLocation },
      order: { name: 'ASC' }
    });
    tecnicians.map(
      (employee) => (employee.email = customEmail(employee.email))
    );
    return tecnicians;
  }
}
