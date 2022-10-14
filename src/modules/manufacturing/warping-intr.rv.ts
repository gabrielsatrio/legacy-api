import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ifs } from '../../database/data-sources';
import { ProdWarpingIntr } from './entities/warping-intr';
import { ProdWarpingIntrInput } from './warping-intr.in';

@Resolver(ProdWarpingIntr)
export class ProdWarpingIntrResolver {
  @Query(() => [ProdWarpingIntr], { nullable: true })
  @UseMiddleware(isAuth)
  async getProdWarpingIntr(
    @Arg('id', () => Number) id: number
  ): Promise<ProdWarpingIntr[] | undefined> {
    try {
      return await ProdWarpingIntr.findBy({
        id
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewLineWarpingIntr(@Arg('id') id: number): Promise<number> {
    try {
      const sql =
        'SELECT NVL(MAX(LINE_NO)+1,1) as "lineNo" FROM GBR_PROD_WARPING_INTR WHERE id = :id';
      const result = await ifs.query(sql, [id]);
      return result[0].lineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarpingIntr)
  @UseMiddleware(isAuth)
  async createProdWarpingIntr(
    @Arg('input') input: ProdWarpingIntrInput
  ): Promise<ProdWarpingIntr> {
    try {
      const data = ProdWarpingIntr.create({
        ...input
      });
      const results = await ProdWarpingIntr.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarpingIntr, { nullable: true })
  @UseMiddleware(isAuth)
  async updateProdWarpingIntr(
    @Arg('input') input: ProdWarpingIntrInput
  ): Promise<ProdWarpingIntr | undefined> {
    try {
      const data = await ProdWarpingIntr.findOneBy({
        id: input.id,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      ProdWarpingIntr.merge(data, {
        ...input
      });
      const result = await ProdWarpingIntr.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarpingIntr)
  @UseMiddleware(isAuth)
  async deleteProdWarpingIntr(
    @Arg('id') id: number,
    @Arg('lineNo') lineNo: number
  ): Promise<ProdWarpingIntr> {
    try {
      const data = await ProdWarpingIntr.findOneBy({ id, lineNo });
      if (!data) throw new Error('No data found.');
      await ProdWarpingIntr.delete({ id, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
