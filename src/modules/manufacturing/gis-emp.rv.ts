import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { GisEmp } from './entities/gis-emp';

@Resolver(GisEmp)
export class GisEmpResolver {
  @Query(() => [GisEmp], { nullable: true })
  @UseMiddleware(isAuth)
  async getGisEmpByWorkLocation(
    @Arg('workLocation') workLocation: string
  ): Promise<GisEmp[]> {
    try {
      return await GisEmp.findBy({ workLocation });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => GisEmp, { nullable: true })
  @UseMiddleware(isAuth)
  async getGisEmpById(
    @Arg('employeeId') employeeId: string
  ): Promise<GisEmp | null> {
    try {
      return await GisEmp.findOneBy({ employeeId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
