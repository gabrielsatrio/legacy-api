import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { GisMeter } from './entities/gis-meter';

import { GisMeterInput } from './gis-meter.in';

@Resolver(GisMeter)
export class GisMeterResolver {
  @Query(() => GisMeter, { nullable: true })
  @UseMiddleware(isAuth)
  async getGisMeter(
    @Arg('inspectId') inspectId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<GisMeter | null> {
    try {
      return await GisMeter.findOneBy({ inspectId, lineNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [GisMeter], { nullable: true })
  @UseMiddleware(isAuth)
  async getGisMeterByInspectId(
    @Arg('inspectId') inspectId: number
  ): Promise<GisMeter[] | undefined> {
    try {
      return await GisMeter.findBy({
        inspectId
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewLineMeter(@Arg('inspectId') inspectId: number): Promise<number> {
    try {
      const sql =
        'SELECT NVL(MAX(LINE_NO)+1,1) as "lineNo" FROM GBR_GIS_METER WHERE INSPECT_ID = :inspectId';
      const result = await ifs.query(sql, [inspectId]);
      return result[0].lineNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisMeter)
  @UseMiddleware(isAuth)
  async createGisMeter(@Arg('input') input: GisMeterInput): Promise<GisMeter> {
    try {
      const data = GisMeter.create({
        ...input
      });
      const results = await GisMeter.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisMeter, { nullable: true })
  @UseMiddleware(isAuth)
  async updateGisMeter(
    @Arg('input') input: GisMeterInput
  ): Promise<GisMeter | undefined> {
    try {
      const data = await GisMeter.findOneBy({
        inspectId: input.inspectId,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      GisMeter.merge(data, {
        ...input
      });
      const result = await GisMeter.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisMeter)
  @UseMiddleware(isAuth)
  async deleteGisMeter(
    @Arg('inspectId') inspectId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<GisMeter> {
    try {
      const data = await GisMeter.findOneBy({ inspectId, lineNo });
      if (!data) throw new Error('No data found.');
      await GisMeter.delete({ inspectId, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
