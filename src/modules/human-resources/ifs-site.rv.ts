import { ifs } from '@/database/data-sources';
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
      return await ifs.query(`
        SELECT    contract AS "contract",
                  delivery_address AS "deliveryAddress",
                  company AS "company",
                  dist_calendar_id AS "distCalendarId",
                  manuf_calendar_id AS "manufCalendarId",
                  offset AS "offset",
                  rowversion AS "rowversion",
                  rowkey AS "rowkey",
                  ctm_contract_alias AS "ctmContractAlias"
        FROM     (SELECT *
                  FROM   site_tab
                  UNION
                  SELECT *
                  FROM   site_tab@ifs8agt)
        ORDER BY contract ASC`);
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
