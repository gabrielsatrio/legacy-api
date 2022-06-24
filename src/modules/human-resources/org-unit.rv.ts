import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { OrgUnitView } from './entities/org-unit.vw';

@Resolver(OrgUnitView)
export class OrgUnitViewResolver {
  @Query(() => [OrgUnitView], { nullable: true })
  @UseMiddleware(isAuth)
  async getUnit(): Promise<OrgUnitView[] | undefined> {
    try {
      return await OrgUnitView.find({
        order: { unit: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
