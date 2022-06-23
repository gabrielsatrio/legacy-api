import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import dayjs from 'dayjs';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Like } from 'typeorm';
import { MtcScheduleTaskInput } from './apm-mtc-schedule-task.in';
import { MtcScheduleTask } from './entities/apm-mtc-schedule-task';
import { MtcScheduleTaskView } from './entities/apm-mtc-schedule-task.vw';

@Resolver(MtcScheduleTaskInput)
export class MtcScheduleTaskResolver {
  @Query(() => [MtcScheduleTaskView])
  @UseMiddleware(isAuth)
  async getMtcScheduleTasks(): Promise<MtcScheduleTaskView[] | undefined> {
    try {
      const result = await MtcScheduleTaskView.find({
        order: { stId: 'ASC' }
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MtcScheduleTaskView])
  @UseMiddleware(isAuth)
  async getMtcScheduleTask(
    @Arg('stId') stId: number
  ): Promise<MtcScheduleTaskView[] | undefined> {
    try {
      const result = await MtcScheduleTaskView.find({
        where: { stId },
        order: { stId: 'ASC' }
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MtcScheduleTaskView])
  @UseMiddleware(isAuth)
  async getMtcSchedTaskBySchedPeriod(
    @Arg('scheduleId') scheduleId: number,
    @Arg('periodId', { nullable: true }) periodId: string
  ): Promise<MtcScheduleTaskView[] | undefined> {
    try {
      let result;
      if (periodId) {
        result = await MtcScheduleTaskView.find({
          where: {
            scheduleId,
            periodId: periodId ? periodId : Like('%')
          },
          order: { stId: 'ASC', scheduleId: 'ASC', periodId: 'ASC' }
        });
      } else {
        result = await MtcScheduleTaskView.find({
          where: { scheduleId },
          order: { stId: 'ASC', scheduleId: 'ASC', periodId: 'ASC' }
        });
      }
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleTaskView)
  @UseMiddleware(isAuth)
  async createMtcScheduleTask(
    @Arg('input') input: MtcScheduleTaskInput
  ): Promise<MtcScheduleTaskView | null> {
    try {
      const sql = `SELECT ROB_APM_Schedule_Task_SEQ.NEXTVAL AS "id" FROM DUAL`;
      const response = await ifs.query(sql);
      const stId = response[0].id;
      const data = MtcScheduleTask.create({
        ...input,
        stId,
        planDate: dayjs(input.planDate).format('YYYY-MM-DD'),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await MtcScheduleTask.save(data);
      const result = await MtcScheduleTaskView.findOneBy({ stId });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleTaskView, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMtcScheduleTask(
    @Arg('stId') stId: number,
    @Arg('input') input: MtcScheduleTaskInput
  ): Promise<MtcScheduleTaskView | null> {
    try {
      const data = await MtcScheduleTask.findOneBy({ stId });
      if (!data) throw new Error('No data found.');
      MtcScheduleTask.merge(data, {
        ...input,
        planDate: dayjs(input.planDate).format('YYYY-MM-DD')
      });
      const response = await MtcScheduleTask.save(data);
      const result = await MtcScheduleTaskView.findOneBy({
        stId: response.stId
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleTaskView)
  @UseMiddleware(isAuth)
  async deleteMtcScheduleTask(
    @Arg('stId') stId: number
  ): Promise<MtcScheduleTaskView> {
    try {
      const data = await MtcScheduleTaskView.findOneBy({ stId });
      if (!data) throw new Error('No data found.');
      await MtcScheduleTask.delete({ stId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
