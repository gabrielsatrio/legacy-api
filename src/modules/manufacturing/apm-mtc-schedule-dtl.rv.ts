import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Like } from 'typeorm';
import { MtcScheduleDtlInput } from './apm-mtc-schedule-dtl.in';
import { MtcScheduleDtl } from './entities/apm-mtc-schedule-dtl';
import { MtcScheduleDtlView } from './entities/apm-mtc-schedule-dtl.vw';

@Resolver(MtcScheduleDtl)
export class MtcScheduleDtlDtlResolver {
  @Query(() => [MtcScheduleDtlView])
  @UseMiddleware(isAuth)
  async getMtcScheduleDtls(): Promise<MtcScheduleDtlView[] | undefined> {
    try {
      const result = await MtcScheduleDtlView.find({
        order: { scheduleId: 'ASC', periodId: 'ASC' }
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MtcScheduleDtlView])
  @UseMiddleware(isAuth)
  async getMtcScheduleDtl(
    @Arg('scheduleId') scheduleId: number,
    @Arg('periodId', { nullable: true }) periodId: string
  ): Promise<MtcScheduleDtlView[] | undefined> {
    try {
      const result = await MtcScheduleDtlView.find({
        where: { scheduleId, periodId: periodId ? periodId : Like('%') },
        order: { scheduleId: 'ASC', periodId: 'ASC' }
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleDtlView)
  @UseMiddleware(isAuth)
  async createMtcScheduleDtl(
    @Arg('input') input: MtcScheduleDtlInput
  ): Promise<MtcScheduleDtlView | null> {
    try {
      const response = await MtcScheduleDtlView.findOneBy({
        scheduleId: input.scheduleId,
        periodId: input.periodId
      });
      if (response) throw new Error('Data already exist.');
      const data = MtcScheduleDtl.create({
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await MtcScheduleDtl.save(data);
      const result = await MtcScheduleDtlView.findOneBy({
        scheduleId: input.scheduleId,
        periodId: input.periodId
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleDtlView, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMtcScheduleDtl(
    @Arg('input') input: MtcScheduleDtlInput
  ): Promise<MtcScheduleDtlView | null> {
    try {
      const data = await MtcScheduleDtl.findOneBy({
        scheduleId: input.scheduleId,
        periodId: input.periodId
      });
      if (!data) throw new Error('No data found.');
      MtcScheduleDtl.merge(data, { ...input });
      const response = await MtcScheduleDtl.save(data);
      const result = await MtcScheduleDtlView.findOneBy({
        scheduleId: response.scheduleId,
        periodId: response.periodId
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleDtlView)
  @UseMiddleware(isAuth)
  async deleteMtcScheduleDtl(
    @Arg('scheduleId') scheduleId: number,
    @Arg('periodId') periodId: string
  ): Promise<MtcScheduleDtlView> {
    try {
      const data = await MtcScheduleDtlView.findOneBy({
        scheduleId,
        periodId
      });
      if (!data) throw new Error('No data found.');
      await MtcScheduleDtl.delete({ scheduleId, periodId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
