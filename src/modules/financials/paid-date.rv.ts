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
import { PaidDate } from './entities/paid-date';
import { PaidDateView } from './entities/paid-date.vw';
import { PaidDateInput } from './paid-date.in';

@Resolver(PaidDate)
export class PaidDateResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkPaidDateExist(@Arg('id', () => Int) id: number): Promise<boolean> {
    try {
      return (await this.getPaidDate(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [PaidDateView])
  @UseMiddleware(isAuth)
  async getAllPaidDate(): Promise<PaidDateView[] | undefined> {
    try {
      return await PaidDate.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => PaidDateView, { nullable: true })
  @UseMiddleware(isAuth)
  async getPaidDate(
    @Arg('id', () => Int) id: number
  ): Promise<PaidDateView | null> {
    try {
      return await PaidDateView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PaidDate)
  @UseMiddleware(isAuth)
  async createPaidDate(
    @Arg('input') input: PaidDateInput
  ): Promise<PaidDate | undefined> {
    try {
      const existingData = await PaidDate.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = PaidDate.create({
        ...input
      });
      const result = await PaidDate.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PaidDate, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePaidDate(
    @Arg('input') input: PaidDateInput
  ): Promise<PaidDate | undefined> {
    try {
      const data = await PaidDate.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      PaidDate.merge(data, { ...input });
      const result = await PaidDate.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PaidDate)
  @UseMiddleware(isAuth)
  async deletePaidDate(@Arg('id', () => Int) id: number): Promise<PaidDate> {
    try {
      const data = await PaidDate.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await PaidDate.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
