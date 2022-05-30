import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInternalCustomerView } from './entities/ifs-internal-customer.vw';

@Resolver(IfsInternalCustomerView)
export class IfsInternalCustomerResolver {
  @Query(() => [IfsInternalCustomerView])
  @UseMiddleware(isAuth)
  async getAllIntCustomers(
    @Arg('contract') contract: string
  ): Promise<IfsInternalCustomerView[]> {
    try {
      let sql = '';
      if (contract === 'AGT') {
        sql = `
          SELECT   int_customer_no  AS "intCustomerNo",
                   name             AS "name",
                   objid            AS "objId"
          FROM     internal_customer@ifs8agt
        `;
      } else {
        sql = `
          SELECT   int_customer_no  AS "intCustomerNo",
                   name             AS "name",
                   objid            AS "objId"
          FROM     internal_customer
        `;
      }
      const result = await ifs.query(sql);
      return result
        .slice()
        .sort((a: Record<string, any>, b: Record<string, any>) =>
          a.name > b.name ? 1 : -1
        );
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
