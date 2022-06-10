import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MachineScheduleInput } from './apm-machine-schedule.in';
import { MachineSchedule } from './entities/apm-machine-schedule';
import { MachineScheduleView } from './entities/apm-machine-schedule.vw';

@Resolver(MachineSchedule)
export class MachineScheduleResolver {
  @Query(() => [MachineScheduleView])
  @UseMiddleware(isAuth)
  async getMachScheduleByContract(
    @Arg('contract') contract: string
  ): Promise<MachineScheduleView[] | undefined> {
    try {
      return await MachineScheduleView.find({
        where: { contract },
        order: { scheduleId: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineScheduleView)
  @UseMiddleware(isAuth)
  async createMachSchedule(
    @Arg('input') input: MachineScheduleInput
  ): Promise<MachineScheduleView | null> {
    try {
      const sql = `SELECT ROB_APM_Schedule_SEQ.NEXTVAL AS "id" FROM DUAL`;
      const response = await ifs.query(sql);
      const data = MachineSchedule.create({
        ...input,
        scheduleId: response[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await MachineSchedule.save(data);
      const result = await MachineScheduleView.findOneBy({
        scheduleId: response[0].id
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineScheduleView, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMachSchedule(
    @Arg('scheduleId') scheduleId: number,
    @Arg('input') input: MachineScheduleInput
  ): Promise<MachineScheduleView | null> {
    try {
      const data = await MachineSchedule.findOneBy({ scheduleId });
      if (!data) throw new Error('No data found.');
      MachineSchedule.merge(data, { ...input });
      const response = await MachineSchedule.save(data);
      const result = await MachineScheduleView.findOneBy({
        scheduleId: response.scheduleId
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineScheduleView)
  @UseMiddleware(isAuth)
  async deleteMachSchedule(
    @Arg('scheduleId') scheduleId: number
  ): Promise<MachineScheduleView> {
    try {
      const data = await MachineScheduleView.findOneBy({ scheduleId });
      if (!data) throw new Error('No data found.');
      await MachineSchedule.delete({ scheduleId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
