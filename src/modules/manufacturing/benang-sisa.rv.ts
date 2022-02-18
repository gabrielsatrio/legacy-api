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
import { In } from 'typeorm';
import { BenangSisaInput } from './benang-sisa.in';
import { BenangSisa } from './entities/benang-sisa';

@Resolver(BenangSisa)
export class BenangSisaResolver {
  @Query(() => [BenangSisa], { nullable: true })
  @UseMiddleware(isAuth)
  async getBenangSisa(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<BenangSisa[] | undefined> {
    return await BenangSisa.find({
      contract: In(contract)
    });
  }

  @Mutation(() => BenangSisa)
  @UseMiddleware(isAuth)
  async createBenangSisa(
    @Arg('input') input: BenangSisaInput
  ): Promise<BenangSisa | undefined> {
    try {
      const check = await BenangSisa.findOne({
        contract: input.contract,
        tanggal: input.tanggal,
        noPalet: input.noPalet,
        noDus: input.noDus
      });

      if (check) throw new Error('Data Already Exists');

      const data = BenangSisa.create({
        ...input
      });
      const results = await BenangSisa.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BenangSisa, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBenangSisa(
    @Arg('input') input: BenangSisaInput
  ): Promise<BenangSisa | undefined | number> {
    try {
      const data = await BenangSisa.findOne({
        contract: input.contract,
        tanggal: input.tanggal,
        noPalet: input.noPalet,
        noDus: input.noDus
      });
      if (!data) throw new Error('No data found.');
      BenangSisa.merge(data, input);
      const results = await BenangSisa.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BenangSisa)
  @UseMiddleware(isAuth)
  async deleteBenangSisa(
    @Arg('contract') contract: string,
    @Arg('tanggal') tanggal: Date,
    @Arg('noPalet') noPalet: string,
    @Arg('noDus', () => Int) noDus: number
  ): Promise<BenangSisa> {
    try {
      const data = await BenangSisa.findOne({
        contract,
        tanggal,
        noPalet,
        noDus
      });
      if (!data) throw new Error('No data found.');
      await BenangSisa.delete({ contract, tanggal, noPalet, noDus });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
