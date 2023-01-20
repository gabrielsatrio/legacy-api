import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ProdWarpingDenier } from './entities/warping-denier';
import { ProdWarpingDenierView } from './entities/warping-denier.vw';
import { ProdWarpingDenierInput } from './warping-denier.in';

@Resolver(ProdWarpingDenier)
export class ProdWarpingDenierResolver {
  @Query(() => [ProdWarpingDenierView], { nullable: true })
  @UseMiddleware(isAuth)
  async getProdWarpingDenier(
    @Arg('id') id: number
  ): Promise<ProdWarpingDenierView[] | undefined> {
    try {
      return await ProdWarpingDenierView.findBy({
        id
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewLineWarpingDenier(@Arg('id') id: number): Promise<number> {
    try {
      const sql =
        'SELECT NVL(MAX(LINE_NO)+1,1) as "lineNo" FROM GBR_PROD_WARPING_DENIER WHERE id = :id';
      const result = await ifs.query(sql, [id]);
      return result[0].lineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarpingDenier)
  @UseMiddleware(isAuth)
  async createProdWarpingDenier(
    @Arg('input') input: ProdWarpingDenierInput
  ): Promise<ProdWarpingDenier> {
    try {
      const data = ProdWarpingDenier.create({
        ...input
      });
      const results = await ProdWarpingDenier.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarpingDenier, { nullable: true })
  @UseMiddleware(isAuth)
  async updateProdWarpingDenier(
    @Arg('input') input: ProdWarpingDenierInput
  ): Promise<ProdWarpingDenier | undefined> {
    try {
      const data = await ProdWarpingDenier.findOneBy({
        id: input.id,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      ProdWarpingDenier.merge(data, {
        ...input
      });
      const result = await ProdWarpingDenier.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarpingDenier)
  @UseMiddleware(isAuth)
  async deleteProdWarpingDenier(
    @Arg('id') id: number,
    @Arg('lineNo') lineNo: number
  ): Promise<ProdWarpingDenier> {
    try {
      const data = await ProdWarpingDenier.findOneBy({ id, lineNo });
      if (!data) throw new Error('No data found.');
      await ProdWarpingDenier.delete({ id, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
