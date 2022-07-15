import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { GisDefect } from './entities/gis-defect';
import { GisDefectView } from './entities/gis-defect.vw';
import { GisDefectInput } from './gis-defect.in';

@Resolver(GisDefect)
export class GisDefectResolver {
  @Query(() => [GisDefectView], { nullable: true })
  @UseMiddleware(isAuth)
  async getGisDefectByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<GisDefectView[] | undefined> {
    try {
      return await GisDefectView.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisDefect)
  @UseMiddleware(isAuth)
  async createGisDefect(
    @Arg('input') input: GisDefectInput,
    @Ctx() { req }: Context
  ): Promise<GisDefect> {
    try {
      const data = GisDefect.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await GisDefect.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisDefect, { nullable: true })
  @UseMiddleware(isAuth)
  async updateGisDefect(
    @Arg('input') input: GisDefectInput
  ): Promise<GisDefect | undefined> {
    try {
      const data = await GisDefect.findOneBy({
        contract: input.contract,
        defectId: input.defectId
      });
      if (!data) throw new Error('No data found.');
      GisDefect.merge(data, {
        ...input
      });
      const result = await GisDefect.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisDefect)
  @UseMiddleware(isAuth)
  async deleteGisDefect(
    @Arg('contract') contract: string,
    @Arg('defectId') defectId: string
  ): Promise<GisDefect> {
    try {
      const data = await GisDefect.findOneBy({ contract, defectId });
      if (!data) throw new Error('No data found.');
      await GisDefect.delete({ contract, defectId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
