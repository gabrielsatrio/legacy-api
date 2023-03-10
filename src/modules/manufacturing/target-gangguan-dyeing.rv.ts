import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { TargetGangguan } from './entities/target-gangguan-dyeing';
import { TargetGangguanInput } from './target_gangguan_dyeing.in';

@Resolver(TargetGangguan)
export class TargetGangguanDyeingResolver {
  @Query(() => [TargetGangguan], { nullable: true })
  @UseMiddleware(isAuth)
  async getTargetGangguanDyeing(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<TargetGangguan[] | undefined> {
    return await TargetGangguan.findBy({
      contract: In(contract)
    });
  }

  @Query(() => [TargetGangguan], { nullable: true })
  @UseMiddleware(isAuth)
  async getTargetGangguanDyeingByPart(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('partNo') partNo: string
  ): Promise<TargetGangguan[] | undefined> {
    const data = await TargetGangguan.findBy({
      contract: In(contract),
      partNo
    });
    if (data.length > 1)
      throw new Error(`Part ${partNo} memiliki lebih dari 1 target`);
    return data;
  }

  @Mutation(() => TargetGangguan)
  @UseMiddleware(isAuth)
  async createTargetGangguanDyeing(
    @Arg('input') input: TargetGangguanInput
  ): Promise<TargetGangguan | undefined> {
    try {
      const check = await TargetGangguan.findOneBy({
        contract: input.contract,
        partNo: input.partNo,
        waktu: input.waktu,
        meter: input.meter
      });
      if (check) throw new Error('Data already exists');
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
      const data = await TargetGangguan.findOneBy({
        contract: input.contract,
        partNo: input.partNo
      });
      if (!data) throw new Error('No data found.');
      TargetGangguan.merge(data, { ...input });
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
      const data = await TargetGangguan.findOneBy({
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
