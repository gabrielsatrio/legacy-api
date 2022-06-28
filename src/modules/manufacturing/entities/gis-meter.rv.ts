import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { GisMeterInput } from './../gis-meter.in';
import { GisMeter } from './gbr-gis-meter';

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
      await GisMeter.delete({ inspectId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
