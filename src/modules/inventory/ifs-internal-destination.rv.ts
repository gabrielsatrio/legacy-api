import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInternalDestinationView } from './entities/ifs-internal-destination.vw';

@Resolver(IfsInternalDestinationView)
export class IfsInternalCustomerResolver {
  @Query(() => [IfsInternalDestinationView])
  @UseMiddleware(isAuth)
  async getIntDestinationsByContract(
    @Arg('contract') contract: string
  ): Promise<IfsInternalDestinationView[]> {
    try {
      let sql = '';
      if (contract === 'AGT') {
        sql = `
          SELECT   destination_id  AS "destinationId",
                   contract        AS "contract",
                   description     AS "description",
                   objkey          AS "objKey"
          FROM     internal_destination_lov@ifs8agt
          WHERE    contract = :contract
        `;
      } else {
        sql = `
          SELECT   destination_id  AS "destinationId",
                   contract        AS "contract",
                   description     AS "description",
                   objkey          AS "objKey"
          FROM     internal_destination_lov
          WHERE    contract = :contract
        `;
      }
      const result = await ifs.query(sql, [contract]);
      return result
        .slice()
        .sort((a: Record<string, any>, b: Record<string, any>) =>
          a.description > b.description ? 1 : -1
        );
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
