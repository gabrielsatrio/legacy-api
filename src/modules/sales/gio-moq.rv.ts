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
import { Moq } from './entities/gio-moq';
import { MoqView } from './entities/gio-moq.vw';
import { MoqInput } from './gio-moq.in';

@Resolver(Moq)
export class MoqResolver {
  @Query(() => [MoqView])
  @UseMiddleware(isAuth)
  async getAllMoq(): Promise<MoqView[]> {
    return await MoqView.find({ order: { orderNo: 'ASC' } });
  }

  @Query(() => MoqView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMoq(
    @Arg('orderNo') orderNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('relNo') relNo: string,
    @Arg('minQty', () => Int) minQty: number
  ): Promise<MoqView | undefined> {
    return await MoqView.findOne({ orderNo, lineNo, relNo, minQty });
  }

  @Mutation(() => Moq)
  @UseMiddleware(isAuth)
  async createMoq(@Arg('input') input: MoqInput): Promise<Moq | undefined> {
    try {
      const check = await Moq.findOne({
        orderNo: input.orderNo,
        lineNo: input.lineNo,
        relNo: input.relNo,
        minQty: input.minQty
      });

      if (check) throw new Error('Data Already Exists');

      const data = Moq.create({
        ...input
      });
      const results = await Moq.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Moq)
  @UseMiddleware(isAuth)
  async updateMoq(@Arg('input') input: MoqInput): Promise<Moq | undefined> {
    try {
      const data = await Moq.findOne({
        orderNo: input.orderNo,
        lineNo: input.lineNo,
        relNo: input.relNo,
        minQty: input.minQty
      });
      if (!data) throw new Error('No data found.');
      Moq.merge(data, input);
      const results = await Moq.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Moq)
  @UseMiddleware(isAuth)
  async deleteMoq(
    @Arg('orderNo') orderNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('relNo') relNo: string,
    @Arg('minQty', () => Int) minQty: number
  ): Promise<Moq> {
    try {
      const data = await Moq.findOne({ orderNo, lineNo, relNo, minQty });
      if (!data) throw new Error('No data found.');
      await Moq.delete({ orderNo, lineNo, relNo, minQty });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
