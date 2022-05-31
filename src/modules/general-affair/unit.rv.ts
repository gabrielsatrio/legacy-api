import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { UnitView } from './entities/unit.vw';

@Resolver(UnitView)
export class UnitViewResolver {
  @Query(() => [UnitView], { nullable: true })
  @UseMiddleware(isAuth)
  async getUnit(): Promise<UnitView[] | undefined> {
    return await UnitView.find({
      order: { unit: 'ASC' }
    });
  }
}
