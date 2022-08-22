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
import { FreightInsuranceInput } from './bi-freight-insurance.in';
import { FreightInsurance } from './entities/bi-freight-insurance';
import { FreightInsuranceView } from './entities/bi-freight-insurance.vw';

@Resolver(FreightInsurance)
export class FreightInsuranceResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkFreightInsuranceExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getFreightInsurance(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [FreightInsuranceView])
  @UseMiddleware(isAuth)
  async getAllFreightInsurance(): Promise<FreightInsuranceView[] | undefined> {
    try {
      return await FreightInsurance.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [FreightInsuranceView], { nullable: true })
  @UseMiddleware(isAuth)
  async getFreightInsuranceByMaster(
    @Arg('imptId', () => Int) imptId: number
  ): Promise<FreightInsuranceView[] | undefined> {
    try {
      return await FreightInsuranceView.findBy({ imptId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => FreightInsuranceView, { nullable: true })
  @UseMiddleware(isAuth)
  async getFreightInsurance(
    @Arg('id', () => Int) id: number
  ): Promise<FreightInsuranceView | null> {
    try {
      return await FreightInsuranceView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => FreightInsurance)
  @UseMiddleware(isAuth)
  async createFreightInsurance(
    @Arg('input') input: FreightInsuranceInput
  ): Promise<FreightInsurance | undefined> {
    try {
      const existingData = await FreightInsurance.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = FreightInsurance.create({
        ...input
      });
      const result = await FreightInsurance.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => FreightInsurance, { nullable: true })
  @UseMiddleware(isAuth)
  async updateFreightInsurance(
    @Arg('input') input: FreightInsuranceInput
  ): Promise<FreightInsurance | undefined> {
    try {
      const data = await FreightInsurance.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      FreightInsurance.merge(data, { ...input });
      const result = await FreightInsurance.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => FreightInsurance)
  @UseMiddleware(isAuth)
  async deleteFreightInsurance(
    @Arg('id', () => Int) id: number
  ): Promise<FreightInsurance> {
    try {
      const data = await FreightInsurance.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await FreightInsurance.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
