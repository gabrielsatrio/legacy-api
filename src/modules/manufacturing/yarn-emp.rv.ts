import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { YarnEmp } from './entities/yarn-emp';
@Resolver(YarnEmp)
export class YarnEmpResolver {
  @Query(() => [YarnEmp], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllYarnEmp(): Promise<YarnEmp[] | undefined> {
    return await YarnEmp.find({});
  }
}
