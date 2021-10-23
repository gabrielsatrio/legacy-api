import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { Salesman } from './entities/salesman.vw';

@Resolver(Salesman)
export class SalesmanResolver {
  @Query(() => [Salesman])
  @UseMiddleware(isAuth)
  async getAllSalesmanCode(): Promise<Salesman[] | undefined> {
    return await Salesman.find();
  }
}
