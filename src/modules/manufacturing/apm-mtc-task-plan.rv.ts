import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Like } from 'typeorm';
import { MtcTaskPlanCreateInput } from './apm-mtc-task-plan.c.in';
import { MtcTaskPlanInput } from './apm-mtc-task-plan.in';
import { MtcTaskResolver } from './apm-mtc-task.rv';
import { MtcTaskPlan } from './entities/apm-mtc-task-plan';
import { MtcTaskPlanView } from './entities/apm-mtc-task-plan.vw';

@Resolver(MtcTaskPlan)
export class MtcTaskPlanResolver {
  @Query(() => [MtcTaskPlanView])
  @UseMiddleware(isAuth)
  async getMtcTaskPlans(): Promise<MtcTaskPlanView[] | undefined> {
    return await MtcTaskPlanView.find({
      order: { scheduleId: 'ASC', periodId: 'ASC', lineNo: 'ASC' }
    });
  }

  @Query(() => [MtcTaskPlanView])
  @UseMiddleware(isAuth)
  async getMtcTaskPlan(
    @Arg('scheduleId', { nullable: true }) scheduleId: number,
    @Arg('periodId', { nullable: true }) periodId: string,
    @Arg('lineNo', { nullable: true }) lineNo: number
  ): Promise<MtcTaskPlanView[] | undefined> {
    try {
      let result;
      if (lineNo) {
        result = await MtcTaskPlanView.find({
          where: {
            scheduleId,
            periodId: periodId ? periodId : Like('%'),
            lineNo
          },
          order: { scheduleId: 'ASC', periodId: 'ASC', lineNo: 'ASC' }
        });
      } else {
        result = await MtcTaskPlanView.find({
          where: {
            scheduleId,
            periodId: periodId ? periodId : Like('%')
          },
          order: { scheduleId: 'ASC', periodId: 'ASC', lineNo: 'ASC' }
        });
      }
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcTaskPlanView)
  @UseMiddleware(isAuth)
  async createMtcTaskPlan(
    @Arg('input', () => MtcTaskPlanCreateInput) input: MtcTaskPlanCreateInput
  ): Promise<MtcTaskPlanView | null> {
    try {
      const sql = `SELECT ROB_APM_Task_Plan_API.Get_New_Line_No(:schedule_id, :period_id) AS "lineNo" FROM DUAL`;
      const response = await ifs.query(sql, [input.scheduleId, input.periodId]);
      const lineNo = response[0].lineNo;
      const Task = new MtcTaskResolver();
      let taskId;
      taskId = await Task.getMtcTaskIdByCustomDesc(input.task);
      if (!taskId) {
        const res = await Task.createMtcTask({
          description: input.task,
          type: input.type,
          uom: input.uom,
          status: 'Active'
        });
        taskId = res?.taskId;
      }
      const data = MtcTaskPlan.create({
        ...input,
        lineNo,
        taskId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await MtcTaskPlan.save(data);
      const result = await MtcTaskPlanView.findOneBy({
        scheduleId: input.scheduleId,
        periodId: input.periodId,
        lineNo
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcTaskPlanView, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMtcTaskPlan(
    @Arg('scheduleId') scheduleId: number,
    @Arg('periodId') periodId: string,
    @Arg('lineNo') lineNo: number,
    @Arg('input') input: MtcTaskPlanInput
  ): Promise<MtcTaskPlanView | null> {
    try {
      const data = await MtcTaskPlan.findOneBy({
        scheduleId,
        periodId,
        lineNo
      });
      if (!data) throw new Error('No data found.');
      MtcTaskPlan.merge(data, { ...input });
      const response = await MtcTaskPlan.save(data);
      const result = await MtcTaskPlanView.findOneBy({
        scheduleId: response.scheduleId,
        periodId: response.periodId,
        lineNo: response.lineNo
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcTaskPlanView)
  @UseMiddleware(isAuth)
  async deleteMtcTaskPlan(
    @Arg('scheduleId') scheduleId: number,
    @Arg('periodId') periodId: string,
    @Arg('lineNo') lineNo: number
  ): Promise<MtcTaskPlanView> {
    try {
      const data = await MtcTaskPlanView.findOneBy({
        scheduleId,
        periodId,
        lineNo
      });
      if (!data) throw new Error('No data found.');
      await MtcTaskPlan.delete({ scheduleId, periodId, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
