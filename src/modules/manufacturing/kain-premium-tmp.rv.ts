import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { KainPremiumTmp } from './entities/kain-premium-tmp';

@Resolver(KainPremiumTmp)
export class KainPremiumTmpResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async generateKainPremiumTmp(
    @Arg('date', () => Date) date: Date
  ): Promise<boolean | null> {
    try {
      const sql = `
        BEGIN
          vky_kain_premium_tmp_api.insert__( :p_from);
        END;
      `;
      await ifs.query(sql, [date]);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
