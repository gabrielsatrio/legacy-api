import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { SiteTab } from './entities/ifs-contract';

@Resolver(SiteTab)
export class IfsContractResolver {
  @Query(() => [SiteTab])
  @UseMiddleware(isAuth)
  async getCompanyOffice(): Promise<SiteTab[] | undefined> {
    try {
      const data = await ifs.query(
        `select contract as "contract" from SITE_TAB`
      );
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
