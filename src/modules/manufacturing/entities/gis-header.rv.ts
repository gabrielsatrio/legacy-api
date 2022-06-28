import { ifs } from '@/database/data-sources';
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
import { GisHeaderInput } from './../gis-header.in';
import { GisHeader } from './gis-header';

@Resolver(GisHeader)
export class GisHeaderResolver {
  @Query(() => GisHeader, { nullable: true })
  @UseMiddleware(isAuth)
  async getGisHeader(
    @Arg('inspectId') inspectId: number
  ): Promise<GisHeader | null> {
    try {
      return await GisHeader.findOneBy({ inspectId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [GisHeader], { nullable: true })
  @UseMiddleware(isAuth)
  async getGisHeaderByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<GisHeader[] | undefined> {
    try {
      return await GisHeader.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Number, { nullable: true })
  @UseMiddleware(isAuth)
  async getNewInspectId(): Promise<number> {
    try {
      const sql = 'SELECT nvl(max(inspect_id)+1,1) as "id" from GBR_GIS_HEADER';
      const result = await ifs.query(sql);
      return result[0].id;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisHeader)
  @UseMiddleware(isAuth)
  async createGisHeader(
    @Arg('input') input: GisHeaderInput,
    @Ctx() { req }: Context
  ): Promise<GisHeader> {
    try {
      const data = GisHeader.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date()
      });
      const results = await GisHeader.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisHeader, { nullable: true })
  @UseMiddleware(isAuth)
  async updateGisHeader(
    @Arg('input') input: GisHeaderInput
  ): Promise<GisHeader | undefined> {
    try {
      const data = await GisHeader.findOneBy({
        inspectId: input.inspectId
      });
      if (!data) throw new Error('No data found.');
      GisHeader.merge(data, {
        ...input
      });
      const result = await GisHeader.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => GisHeader)
  @UseMiddleware(isAuth)
  async deleteGisHeader(
    @Arg('inspectId') inspectId: number
  ): Promise<GisHeader> {
    try {
      const data = await GisHeader.findOneBy({ inspectId });
      if (!data) throw new Error('No data found.');
      await GisHeader.delete({ inspectId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
