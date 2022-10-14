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
import { OtherChargesInput } from './bi-other-charges.in';
import { OtherCharges } from './entities/bi-other-charges';
import { OtherChargesView } from './entities/bi-other-charges.vw';

@Resolver(OtherCharges)
export class OtherChargesResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkOtherChargesExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getOtherCharges(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [OtherChargesView])
  @UseMiddleware(isAuth)
  async getAllOtherCharges(): Promise<OtherChargesView[] | undefined> {
    try {
      return await OtherCharges.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [OtherChargesView], { nullable: true })
  @UseMiddleware(isAuth)
  async getOtherChargesByMaster(
    @Arg('imptId', () => Int) imptId: number
  ): Promise<OtherChargesView[] | undefined> {
    try {
      return await OtherChargesView.findBy({ imptId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => OtherChargesView, { nullable: true })
  @UseMiddleware(isAuth)
  async getOtherCharges(
    @Arg('id', () => Int) id: number
  ): Promise<OtherChargesView | null> {
    try {
      return await OtherChargesView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => OtherCharges)
  @UseMiddleware(isAuth)
  async createOtherCharges(
    @Arg('input') input: OtherChargesInput
  ): Promise<OtherCharges | undefined> {
    try {
      const existingData = await OtherCharges.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = OtherCharges.create({
        ...input
      });
      const result = await OtherCharges.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => OtherCharges, { nullable: true })
  @UseMiddleware(isAuth)
  async updateOtherCharges(
    @Arg('input') input: OtherChargesInput
  ): Promise<OtherCharges | undefined> {
    try {
      const data = await OtherCharges.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      OtherCharges.merge(data, { ...input });
      const result = await OtherCharges.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => OtherCharges)
  @UseMiddleware(isAuth)
  async deleteOtherCharges(
    @Arg('id', () => Int) id: number
  ): Promise<OtherCharges> {
    try {
      const data = await OtherCharges.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await OtherCharges.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
