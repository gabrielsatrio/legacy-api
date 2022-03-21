import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { TargetGangguan } from './entities/target_gangguan_dyeing';
import { TargetGangguanInput } from './target_gangguan_dyeing.in';

@Resolver(TargetGangguan)
export class BenangTargetGangguanDyeing {
  @Query(() => [TargetGangguan], { nullable: true })
  @UseMiddleware(isAuth)
  async getTargetGangguanDyeing(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<TargetGangguan[] | undefined> {
    return await TargetGangguan.find({
      contract: In(contract)
    });
  }

  @Mutation(() => TargetGangguan)
  @UseMiddleware(isAuth)
  async createTargetGangguanDyeing(
    @Arg('input') input: TargetGangguanInput
  ): Promise<TargetGangguan | undefined> {
    try {
      const check = await TargetGangguan.findOne({
        contract: input.contract,
        partNo: input.partNo,
        waktu: input.waktu,
        meter: input.meter
      });

      if (check) throw new Error('Data Already Exists');

      const data = TargetGangguan.create({
        ...input
      });
      const results = await TargetGangguan.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => TargetGangguan, { nullable: true })
  @UseMiddleware(isAuth)
  async updateTargetGangguanDyeing(
    @Arg('input') input: TargetGangguanInput
  ): Promise<TargetGangguan | undefined | number> {
    try {
      const data = await TargetGangguan.findOne({
        contract: input.contract,
        partNo: input.partNo
      });
      if (!data) throw new Error('No data found.');
      TargetGangguan.merge(data, input);
      const results = await TargetGangguan.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => TargetGangguan)
  @UseMiddleware(isAuth)
  async deleteTargetGangguanDyeing(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<TargetGangguan> {
    try {
      const data = await TargetGangguan.findOne({
        contract,
        partNo
      });
      if (!data) throw new Error('No data found.');
      await TargetGangguan.delete({ contract, partNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
