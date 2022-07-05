import { isAuth } from '@/middlewares/is-auth';
import { EmployeeView } from '@/modules/human-resources/entities/org-employee.vw';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { TechnicianView } from './entities/technician.vw';

@Resolver()
export class TechnicianResolver {
  @Query(() => [EmployeeView])
  @UseMiddleware(isAuth)
  async getTechnicians(
    @Arg('workLocation', () => [String]) workLocation: string[]
  ): Promise<EmployeeView[]> {
    try {
      const technicians = await TechnicianView.find({
        where: { workLocation: In(workLocation) },
        order: { name: 'ASC' }
      });
      return technicians;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
