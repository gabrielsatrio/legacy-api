import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { YarnEmp } from './entities/yarn-emp';

@Resolver(YarnEmp)
export class YarnEmpResolver {
  @Query(() => [YarnEmp], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllYarnEmp(): Promise<YarnEmp[] | undefined> {
    try {
      return await YarnEmp.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
