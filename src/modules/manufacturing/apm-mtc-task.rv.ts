import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MtcTaskInput } from './apm-mtc-task.in';
import { MtcTask } from './entities/apm-mtc-task';

@Resolver(MtcTask)
export class MtcTaskResolver {
  @Query(() => [MtcTask])
  @UseMiddleware(isAuth)
  async getMtcTasks(): Promise<MtcTask[] | undefined> {
    return await MtcTask.find({ order: { taskId: 'ASC' } });
  }

  @Query(() => MtcTask)
  @UseMiddleware(isAuth)
  async getMtcTask(@Arg('taskId') taskId: string): Promise<MtcTask | null> {
    return await MtcTask.findOneBy({ taskId });
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getMtcTaskIdByCustomDesc(
    @Arg('description') description: string
  ): Promise<string | null> {
    try {
      const sql = `
        SELECT   task_id AS "taskId"
        FROM     ROB_APM_Task
        WHERE    LOWER(REPLACE(description, ' ', '')) = LOWER(REPLACE( :description, ' ', ''))
      `;
      const response = await ifs.query(sql, [description]);
      return response.length > 0 ? response[0].taskId : null;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcTask)
  @UseMiddleware(isAuth)
  async createMtcTask(
    @Arg('input') input: MtcTaskInput
  ): Promise<MtcTask | null> {
    try {
      const sql = `SELECT 'T' || LPAD(ROB_APM_Task_SEQ.NEXTVAL, 4, '0') AS "taskId" FROM DUAL`;
      const response = await ifs.query(sql);
      const taskId = response[0].taskId;
      const data = MtcTask.create({
        ...input,
        taskId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await MtcTask.save(data);
      const result = await MtcTask.findOneBy({ taskId });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcTask, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMtcTask(
    @Arg('taskId') taskId: string,
    @Arg('input') input: MtcTaskInput
  ): Promise<MtcTask | null> {
    try {
      const data = await MtcTask.findOneBy({ taskId });
      if (!data) throw new Error('No data found.');
      MtcTask.merge(data, { ...input });
      const response = await MtcTask.save(data);
      const result = await MtcTask.findOneBy({ taskId: response.taskId });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcTask)
  @UseMiddleware(isAuth)
  async deleteMtcTask(@Arg('taskId') taskId: string): Promise<MtcTask> {
    try {
      const data = await MtcTask.findOneBy({ taskId });
      if (!data) throw new Error('No data found.');
      await MtcTask.delete({ taskId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
