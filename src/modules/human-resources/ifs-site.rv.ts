import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { SiteTab } from './entities/ifs-site';

@Resolver(SiteTab)
export class IfsSiteResolver {
  @Query(() => [SiteTab])
  @UseMiddleware(isAuth)
  async getAllSite(): Promise<SiteTab[] | undefined> {
    try {
      return await SiteTab.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
