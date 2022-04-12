import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { KeteranganLostTime } from './entities/ket-lost-time';
import { KeteranganLostTimeInput } from './ket-lost-time.in';

@Resolver(KeteranganLostTime)
export class KeteranganLostTimeResolver {
  @Query(() => [KeteranganLostTime], { nullable: true })
  @UseMiddleware(isAuth)
  async getKeteranganLostTime(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<KeteranganLostTime[] | undefined> {
    return await KeteranganLostTime.findBy({
      contract: In(contract)
    });
  }

  @Mutation(() => KeteranganLostTime)
  @UseMiddleware(isAuth)
  async createKeteranganLostTime(
    @Arg('input') input: KeteranganLostTimeInput
  ): Promise<KeteranganLostTime | undefined> {
    try {
      const check = await KeteranganLostTime.findOneBy({
        contract: input.contract,
        lostTime: input.lostTime
      });
      if (check) throw new Error('Data already exists.');
      const data = KeteranganLostTime.create({
        ...input
      });
      const results = await KeteranganLostTime.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => KeteranganLostTime, { nullable: true })
  @UseMiddleware(isAuth)
  async updateKeteranganLostTime(
    @Arg('input') input: KeteranganLostTimeInput
  ): Promise<KeteranganLostTime | undefined | number> {
    try {
      const data = await KeteranganLostTime.findOneBy({
        contract: input.contract,
        lostTime: input.lostTime
      });
      if (!data) throw new Error('No data found.');
      KeteranganLostTime.merge(data, { ...input });
      const results = await KeteranganLostTime.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => KeteranganLostTime)
  @UseMiddleware(isAuth)
  async deleteKeteranganLostTime(
    @Arg('contract') contract: string,
    @Arg('lostTime') lostTime: string
  ): Promise<KeteranganLostTime> {
    try {
      const data = await KeteranganLostTime.findOneBy({
        contract,
        lostTime
      });
      if (!data) throw new Error('No data found.');
      await KeteranganLostTime.delete({ contract, lostTime });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
