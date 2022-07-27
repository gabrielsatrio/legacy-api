import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { GisOperator } from './entities/gis-operator';
import { GisOperatorView } from './entities/gis-operator.vw';
import { GisOperatorInput } from './gis-operator.in';

@Resolver(GisOperator)
export class GisOperatorResolver {
  @Query(() => GisOperatorView, { nullable: true })
  @UseMiddleware(isAuth)
  async getGisOperator(
    @Arg('inspectId') inspectId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<GisOperatorView | null> {
    try {
      return await GisOperatorView.findOneBy({ inspectId, lineNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [GisOperatorView], { nullable: true })
  @UseMiddleware(isAuth)
  async getGisOperatorByInspectId(
    @Arg('inspectId') inspectId: number
  ): Promise<GisOperatorView[] | undefined> {
    try {
      return await GisOperatorView.findBy({
        inspectId
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewLineOperator(
    @Arg('inspectId') inspectId: number
  ): Promise<number> {
    try {
      const sql =
        'SELECT NVL(MAX(LINE_NO)+1,1) as "lineNo" FROM GBR_GIS_OPERATOR WHERE INSPECT_ID = :inspectId';
      const result = await ifs.query(sql, [inspectId]);
      return result[0].lineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisOperator)
  @UseMiddleware(isAuth)
  async createGisOperator(
    @Arg('input') input: GisOperatorInput
  ): Promise<GisOperator> {
    try {
      const data = GisOperator.create({
        ...input
      });
      const results = await GisOperator.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisOperator, { nullable: true })
  @UseMiddleware(isAuth)
  async updateGisOperator(
    @Arg('input') input: GisOperatorInput
  ): Promise<GisOperator | undefined> {
    try {
      const data = await GisOperator.findOneBy({
        inspectId: input.inspectId,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      GisOperator.merge(data, {
        ...input
      });
      const result = await GisOperator.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisOperator)
  @UseMiddleware(isAuth)
  async deleteGisOperator(
    @Arg('inspectId') inspectId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<GisOperator> {
    try {
      const data = await GisOperator.findOneBy({ inspectId, lineNo });
      if (!data) throw new Error('No data found.');
      await GisOperator.delete({ inspectId, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
