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
import { Like } from 'typeorm';
import { CourierFeePrepaidInput } from './courier-fee-prepaid.in';
import { CourierFeePrepaid } from './entities/courier-fee-prepaid';
import { CourierFeePrepaidView } from './entities/courier-fee-prepaid.vw';

@Resolver(CourierFeePrepaid)
export class CourierFeePrepaidResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkCourierFeePrepaidExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getCourierFeePrepaid(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [CourierFeePrepaidView])
  @UseMiddleware(isAuth)
  async getAllCourierFeePrepaid(): Promise<
    CourierFeePrepaidView[] | undefined
  > {
    try {
      return await CourierFeePrepaid.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => CourierFeePrepaidView, { nullable: true })
  @UseMiddleware(isAuth)
  async getCourierFeePrepaid(
    @Arg('id', () => Int) id: number
  ): Promise<CourierFeePrepaidView | null> {
    try {
      return await CourierFeePrepaidView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => CourierFeePrepaid)
  @UseMiddleware(isAuth)
  async createCourierFeePrepaid(
    @Arg('input') input: CourierFeePrepaidInput
  ): Promise<CourierFeePrepaid | undefined> {
    try {
      const existingData = await CourierFeePrepaid.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = CourierFeePrepaid.create({
        ...input
      });
      const result = await CourierFeePrepaid.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => CourierFeePrepaid, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCourierFeePrepaid(
    @Arg('input') input: CourierFeePrepaidInput
  ): Promise<CourierFeePrepaid | undefined> {
    try {
      const data = await CourierFeePrepaid.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      CourierFeePrepaid.merge(data, { ...input });
      const result = await CourierFeePrepaid.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => CourierFeePrepaid)
  @UseMiddleware(isAuth)
  async deleteCourierFeePrepaid(
    @Arg('id', () => Int) id: number
  ): Promise<CourierFeePrepaid> {
    try {
      const data = await CourierFeePrepaid.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await CourierFeePrepaid.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [CourierFeePrepaidView])
  @UseMiddleware(isAuth)
  async getCourierFeePrepaidByContract(
    @Arg('contract') contract: string
  ): Promise<CourierFeePrepaidView[] | undefined> {
    return await CourierFeePrepaidView.find({
      where: {
        contract: Like(contract)
      }
    });
  }
}
