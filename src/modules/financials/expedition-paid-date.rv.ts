import { ifs } from '@/database/data-sources';
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
import { ExpeditionPaidDate } from './entities/expedition-paid-date';
import { ExpeditionPaidDateView } from './entities/expedition-paid-date.vw';
import { ExpeditionPaidDateInput } from './expedition-paid-date.in';

@Resolver(ExpeditionPaidDate)
export class ExpeditionPaidDateResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkExpeditionPaidDateExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getExpeditionPaidDate(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ExpeditionPaidDateView])
  @UseMiddleware(isAuth)
  async getAllExpeditionPaidDate(): Promise<
    ExpeditionPaidDateView[] | undefined
  > {
    try {
      return await ExpeditionPaidDateView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => ExpeditionPaidDateView, { nullable: true })
  @UseMiddleware(isAuth)
  async getExpeditionPaidDate(
    @Arg('id', () => Int) id: number
  ): Promise<ExpeditionPaidDateView | null> {
    try {
      return await ExpeditionPaidDateView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getArPersonnel(
    @Arg('plant') plant: string
  ): Promise<string | undefined> {
    try {
      const sql = `SELECT ANG_AR_PERSONNEL_API.GET_AR_PERSONNEL(:plant) AS "arPersonnel" FROM DUAL`;
      const result = await ifs.query(sql, [plant]);
      return result[0].arPersonnel;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ExpeditionPaidDate)
  @UseMiddleware(isAuth)
  async createExpeditionPaidDate(
    @Arg('input') input: ExpeditionPaidDateInput
  ): Promise<ExpeditionPaidDate | undefined> {
    try {
      const existingData = await ExpeditionPaidDate.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = ExpeditionPaidDate.create({
        ...input
      });
      const result = await ExpeditionPaidDate.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ExpeditionPaidDate, { nullable: true })
  @UseMiddleware(isAuth)
  async updateExpeditionPaidDate(
    @Arg('input') input: ExpeditionPaidDateInput
  ): Promise<ExpeditionPaidDate | undefined> {
    try {
      const data = await ExpeditionPaidDate.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      ExpeditionPaidDate.merge(data, { ...input });
      const result = await ExpeditionPaidDate.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ExpeditionPaidDate)
  @UseMiddleware(isAuth)
  async deleteExpeditionPaidDate(
    @Arg('id', () => Int) id: number
  ): Promise<ExpeditionPaidDate> {
    try {
      const data = await ExpeditionPaidDate.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await ExpeditionPaidDate.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ExpeditionPaidDateView])
  @UseMiddleware(isAuth)
  async getExpeditionPaidDateByContract(
    @Arg('contract') contract: string
  ): Promise<ExpeditionPaidDateView[] | undefined> {
    return await ExpeditionPaidDateView.find({
      where: {
        plant: Like(contract)
      }
    });
  }
}
