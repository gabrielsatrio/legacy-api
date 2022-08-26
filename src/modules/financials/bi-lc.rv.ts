import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { LcChargesInput } from './bi-lc.in';
import { LcCharges } from './entities/bi-lc';
import { LcChargesView } from './entities/bi-lc.vw';

@Resolver(LcCharges)
export class LcChargesResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkLcChargesExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getLcCharges(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [LcChargesView])
  @UseMiddleware(isAuth)
  async getAllLcCharges(): Promise<LcChargesView[] | undefined> {
    try {
      return await LcCharges.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [LcChargesView], { nullable: true })
  @UseMiddleware(isAuth)
  async getLcChargesByMaster(
    @Arg('imptId', () => Int) imptId: number
  ): Promise<LcChargesView[] | undefined> {
    try {
      return await LcChargesView.findBy({ imptId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => LcChargesView, { nullable: true })
  @UseMiddleware(isAuth)
  async getLcCharges(
    @Arg('id', () => Int) id: number
  ): Promise<LcChargesView | null> {
    try {
      return await LcChargesView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => LcCharges)
  @UseMiddleware(isAuth)
  async createLcCharges(
    @Arg('input') input: LcChargesInput
  ): Promise<LcCharges | undefined> {
    try {
      const existingData = await LcCharges.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = LcCharges.create({
        ...input
      });
      const result = await LcCharges.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => LcCharges, { nullable: true })
  @UseMiddleware(isAuth)
  async updateLcCharges(
    @Arg('input') input: LcChargesInput
  ): Promise<LcCharges | undefined> {
    try {
      const data = await LcCharges.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      LcCharges.merge(data, { ...input });
      const result = await LcCharges.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => LcCharges)
  @UseMiddleware(isAuth)
  async deleteLcCharges(@Arg('id', () => Int) id: number): Promise<LcCharges> {
    try {
      const data = await LcCharges.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await LcCharges.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
