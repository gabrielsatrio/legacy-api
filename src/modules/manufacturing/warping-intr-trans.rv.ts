import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ProdWarpingIntrTrans } from './entities/warping-intr-trans';
import { ProdWarpingIntrTransInput } from './warping-intr-trans.in';

@Resolver(ProdWarpingIntrTrans)
export class ProdWarpingIntrResolver {
  @Query(() => [ProdWarpingIntrTrans], { nullable: true })
  @UseMiddleware(isAuth)
  async getProdWarpingIntrTrans(
    @Arg('id', () => Number) id: number
  ): Promise<ProdWarpingIntrTrans[] | undefined> {
    try {
      return await ProdWarpingIntrTrans.findBy({
        id
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewLineWarpingIntrTrans(@Arg('id') id: number): Promise<number> {
    try {
      const sql =
        'SELECT NVL(MAX(LINE_NO)+1,1) as "lineNo" FROM GBR_PROD_WARPING_INTR_TRANS WHERE id = :id';
      const result = await ifs.query(sql, [id]);
      return result[0].lineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarpingIntrTrans)
  @UseMiddleware(isAuth)
  async createProdWarpingIntrTrans(
    @Arg('input') input: ProdWarpingIntrTransInput
  ): Promise<ProdWarpingIntrTrans> {
    try {
      const data = ProdWarpingIntrTrans.create({
        ...input
      });
      const results = await ProdWarpingIntrTrans.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarpingIntrTrans, { nullable: true })
  @UseMiddleware(isAuth)
  async updateProdWarpingIntrTrans(
    @Arg('input') input: ProdWarpingIntrTransInput
  ): Promise<ProdWarpingIntrTrans | undefined> {
    try {
      const data = await ProdWarpingIntrTrans.findOneBy({
        id: input.id,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      ProdWarpingIntrTrans.merge(data, {
        ...input
      });
      const result = await ProdWarpingIntrTrans.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarpingIntrTrans)
  @UseMiddleware(isAuth)
  async deleteProdWarpingIntrTrans(
    @Arg('id') id: number,
    @Arg('lineNo') lineNo: number
  ): Promise<ProdWarpingIntrTrans> {
    try {
      const data = await ProdWarpingIntrTrans.findOneBy({ id, lineNo });
      if (!data) throw new Error('No data found.');
      await ProdWarpingIntrTrans.delete({ id, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
