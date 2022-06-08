import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MtcScheduleTaskRlzInput } from './apm-mtc-schedule-task-rlz.in';
import { MtcScheduleTaskRlz } from './entities/apm-mtc-schedule-task-rlz';
import { MtcScheduleTaskRlzView } from './entities/apm-mtc-schedule-task-rlz.vw';

@Resolver(MtcScheduleTaskRlz)
export class MtcScheduleTaskRlzDtlResolver {
  @Query(() => [MtcScheduleTaskRlzView])
  @UseMiddleware(isAuth)
  async getMtcScheduleTaskRlz(): Promise<MtcScheduleTaskRlzView[] | undefined> {
    try {
      const result = await MtcScheduleTaskRlzView.find({
        order: { stId: 'ASC', lineNo: 'ASC', taskId: 'ASC' }
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MtcScheduleTaskRlzView])
  @UseMiddleware(isAuth)
  async getMtcScheduleTaskRlzByStId(
    @Arg('stId') stId: number
  ): Promise<MtcScheduleTaskRlzView[] | undefined> {
    try {
      const result = await MtcScheduleTaskRlzView.find({
        where: { stId },
        order: { stId: 'ASC', lineNo: 'ASC', taskId: 'ASC' }
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MtcScheduleTaskRlzView])
  @UseMiddleware(isAuth)
  async getMtcScheduleTaskRlzByStIdLineNo(
    @Arg('stId') stId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<MtcScheduleTaskRlzView[] | undefined> {
    try {
      const result = await MtcScheduleTaskRlzView.find({
        where: { stId, lineNo },
        order: { stId: 'ASC', lineNo: 'ASC', taskId: 'ASC' }
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleTaskRlzView)
  @UseMiddleware(isAuth)
  async createMtcScheduleTaskRlz(
    @Arg('input') input: MtcScheduleTaskRlzInput
  ): Promise<MtcScheduleTaskRlzView | null> {
    try {
      const response = await MtcScheduleTaskRlzView.findOneBy({
        stId: input.stId,
        lineNo: input.lineNo
      });
      if (response) throw new Error('Data already exist.');
      const data = MtcScheduleTaskRlz.create({
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await MtcScheduleTaskRlz.save(data);
      const result = await MtcScheduleTaskRlzView.findOneBy({
        stId: input.stId,
        lineNo: input.lineNo
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleTaskRlzView, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMtcScheduleTaskRlz(
    @Arg('input') input: MtcScheduleTaskRlzInput
  ): Promise<MtcScheduleTaskRlzView | null> {
    try {
      const data = await MtcScheduleTaskRlz.findOneBy({
        stId: input.stId,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      MtcScheduleTaskRlz.merge(data, { ...input });
      const response = await MtcScheduleTaskRlz.save(data);
      const result = await MtcScheduleTaskRlzView.findOneBy({
        stId: response.stId,
        lineNo: response.lineNo
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MtcScheduleTaskRlzView)
  @UseMiddleware(isAuth)
  async deleteMtcScheduleTaskRlz(
    @Arg('stId') stId: number,
    @Arg('lineNo') lineNo: number
  ): Promise<MtcScheduleTaskRlzView> {
    try {
      const data = await MtcScheduleTaskRlzView.findOneBy({
        stId,
        lineNo
      });
      if (!data) throw new Error('No data found.');
      await MtcScheduleTaskRlz.delete({ stId, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
