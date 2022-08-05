import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { SoObatApr } from './entities/mdp-so-obat-apr';

@Resolver(SoObatApr)
export class SoObatAprResolver {
  @Query(() => [SoObatApr], { nullable: true })
  @UseMiddleware(isAuth)
  async getSoObatApr(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<SoObatApr[] | undefined> {
    return await SoObatApr.find({
      relations: { details: true },
      where: { contract: In(contract), status: 'Planned' }
    });
  }

  @Mutation(() => SoObatApr)
  @UseMiddleware(isAuth)
  async approveSoObatApr(
    @Arg('orderNo') orderNo: string
  ): Promise<SoObatApr | null> {
    try {
      const data = await SoObatApr.findOneBy({
        orderNo: orderNo
      });

      if (!data) throw new Error('No data found.');

      const sql = `
    BEGIN
    CHR_SO_OBAT_API.APPROVE_ORDER_OBAT_AGT(
      :orderNo);
    END;
  `;

      await ifs.query(sql, [orderNo]);

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
