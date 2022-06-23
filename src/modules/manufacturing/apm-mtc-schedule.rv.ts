import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MtcScheduleInput } from './apm-mtc-schedule.in';
import { MtcSchedule } from './entities/apm-mtc-schedule';
import { MtcScheduleView } from './entities/apm-mtc-schedule.vw';

@Resolver(MtcSchedule)
export class MtcScheduleResolver {
  @Query(() => [MtcScheduleView])
  @UseMiddleware(isAuth)
  async getMtcScheduleByContract(
    @Arg('contract') contract: string
  ): Promise<MtcScheduleView[] | undefined> {
    try {
      return await MtcScheduleView.find({
        where: { contract },
        order: { scheduleId: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleView)
  @UseMiddleware(isAuth)
  async createMtcSchedule(
    @Arg('input') input: MtcScheduleInput
  ): Promise<MtcScheduleView | null> {
    try {
      const sql = `SELECT ROB_APM_Schedule_SEQ.NEXTVAL AS "id" FROM DUAL`;
      const response = await ifs.query(sql);
      const scheduleId = response[0].id;
      const data = MtcSchedule.create({
        ...input,
        scheduleId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await MtcSchedule.save(data);
      const result = await MtcScheduleView.findOneBy({ scheduleId });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleView, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMtcSchedule(
    @Arg('scheduleId') scheduleId: number,
    @Arg('input') input: MtcScheduleInput
  ): Promise<MtcScheduleView | null> {
    try {
      const data = await MtcSchedule.findOneBy({ scheduleId });
      if (!data) throw new Error('No data found.');
      MtcSchedule.merge(data, { ...input });
      const response = await MtcSchedule.save(data);
      const result = await MtcScheduleView.findOneBy({
        scheduleId: response.scheduleId
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleView)
  @UseMiddleware(isAuth)
  async deleteMtcSchedule(
    @Arg('scheduleId') scheduleId: number
  ): Promise<MtcScheduleView> {
    try {
      const data = await MtcScheduleView.findOneBy({ scheduleId });
      if (!data) throw new Error('No data found.');
      await MtcSchedule.delete({ scheduleId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
