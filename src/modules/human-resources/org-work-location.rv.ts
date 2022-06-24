import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { OrgWorkLocationView } from './entities/org-work-location.vw';

@Resolver(OrgWorkLocationView)
export class OrgWorkLocationViewResolver {
  @Query(() => [OrgWorkLocationView], { nullable: true })
  @UseMiddleware(isAuth)
  async getWorkLocation(): Promise<OrgWorkLocationView[] | undefined> {
    try {
      return await OrgWorkLocationView.find({
        order: { workLocation: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
