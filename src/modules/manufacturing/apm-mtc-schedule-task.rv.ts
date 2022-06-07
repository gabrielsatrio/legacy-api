import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { MtcScheduleTaskInput } from './apm-mtc-schedule-task.in';
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

  // @Query(() => [MtcScheduleTaskView])
  // @UseMiddleware(isAuth)
  // async getMtcTaskPlan(
  //   @Arg('stId', { nullable: true }) stId: number,
  //   @Arg('scheduleId', { nullable: true }) scheduleId: number,
  //   @Arg('periodId', { nullable: true }) periodId: string
  // ): Promise<MtcScheduleTaskView[] | undefined> {
  //   try {
  //     let result;
  //     if (periodId) {
  //       result = await MtcScheduleTaskView.find({
  //         where: {
  //           scheduleId,
  //           periodId: periodId ? periodId : Like('%')
  //         },
  //         order: { stId: 'ASC' }
  //       });
  //     } else {
  //       result = await MtcScheduleTaskView.find({
  //         where: { stId },
  //         order: { stId: 'ASC' }
  //       });
  //     }
  //     return result;
  //   } catch (err) {
  //     throw new Error(mapError(err));
  //   }
  // }

  // @Mutation(() => MtcScheduleTaskView)
  // @UseMiddleware(isAuth)
  // async createMtcScheduleTask(
  //   @Arg('input') input: MtcScheduleTask
  // ): Promise<MtcScheduleTaskView | null> {
  //   try {
  //     const response = await MtcScheduleTaskView.findOneBy({
  //       scheduleId: input.scheduleId,
  //       periodId: input.periodId
  //     });
  //     if (response) throw new Error('Data already exist.');
  //     const data = MtcScheduleTask.create({
  //       ...input,
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     });
  //     await MtcScheduleTask.save(data);
  //     const result = await MtcScheduleTaskView.findOneBy({
  //       scheduleId: input.scheduleId,
  //       periodId: input.periodId
  //     });
  //     return result;
  //   } catch (err) {
  //     throw new Error(mapError(err));
  //   }
  // }

  // @Mutation(() => MtcScheduleTaskView, { nullable: true })
  // @UseMiddleware(isAuth)
  // async updateMtcScheduleTask(
  //   @Arg('scheduleId') scheduleId: number,
  //   @Arg('periodId') periodId: string,
  //   @Arg('input') input: MtcScheduleTask
  // ): Promise<MtcScheduleTaskView | null> {
  //   try {
  //     const data = await MtcScheduleTask.findOneBy({ scheduleId, periodId });
  //     if (!data) throw new Error('No data found.');
  //     MtcScheduleTask.merge(data, { ...input });
  //     const response = await MtcScheduleTask.save(data);
  //     const result = await MtcScheduleTaskView.findOneBy({
  //       scheduleId: response.scheduleId,
  //       periodId: response.periodId
  //     });
  //     return result;
  //   } catch (err) {
  //     throw new Error(mapError(err));
  //   }
  // }

  // @Mutation(() => MtcScheduleTaskView)
  // @UseMiddleware(isAuth)
  // async deleteMtcScheduleTask(
  //   @Arg('scheduleId') scheduleId: number,
  //   @Arg('periodId') periodId: string
  // ): Promise<MtcScheduleTaskView> {
  //   try {
  //     const data = await MtcScheduleTaskView.findOneBy({
  //       scheduleId,
  //       periodId
  //     });
  //     if (!data) throw new Error('No data found.');
  //     await MtcScheduleTask.delete({ scheduleId, periodId });
  //     return data;
  //   } catch (err) {
  //     throw new Error(mapError(err));
  //   }
  // }
}
