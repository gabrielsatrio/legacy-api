import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Moq } from './entities/moq';
import { MoqView } from './entities/moq.vw';
import { MoqInput } from './moq.in';

@Resolver(Moq)
export class MachineResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkMoqExist(
    @Arg('orderNo') orderNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('relNo') relNo: string
  ): Promise<boolean> {
    return (await this.getMoq(orderNo, lineNo, relNo)) ? true : false;
  }

  @Query(() => [MoqView])
  @UseMiddleware(isAuth)
  async getAllMoq(): Promise<MoqView[] | undefined> {
    return await MoqView.find();
  }

  @Query(() => MoqView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMoq(
    @Arg('orderNo') orderNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('relNo') relNo: string
  ): Promise<MoqView | undefined> {
    return await MoqView.findOne({ orderNo, lineNo, relNo });
  }

  @Mutation(() => Moq)
  @UseMiddleware(isAuth)
  async createMoq(@Arg('input') input: MoqInput): Promise<Moq | undefined> {
    try {
      const existingData = await Moq.findOne({
        orderNo: input.orderNo,
        lineNo: input.lineNo,
        relNo: input.relNo
      });
      if (existingData) throw new Error('Data already exists.');
      const data = Moq.create({
        ...input
      });
      const result = await Moq.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Moq, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMoq(@Arg('input') input: MoqInput): Promise<Moq | undefined> {
    try {
      const data = await Moq.findOne({
        orderNo: input.orderNo,
        lineNo: input.lineNo,
        relNo: input.relNo
      });
      if (!data) throw new Error('No data found.');
      Moq.merge(data, input);
      const result = await Moq.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Moq)
  @UseMiddleware(isAuth)
  async deleteMoq(
    @Arg('orderNo') orderNo: string,
    @Arg('lineNo') lineNo: string,
    @Arg('relNo') relNo: string
  ): Promise<Moq> {
    try {
      const data = await Moq.findOne({ orderNo, lineNo, relNo });
      if (!data) throw new Error('No data found.');
      await Moq.delete({ orderNo, lineNo, relNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
