import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MachineScheduleInput } from './apm-machine-schedule.in';
import { MachineSchedule } from './entities/apm-machine-schedule';

@Resolver(MachineSchedule)
export class MachineScheduleResolver {
  @Query(() => [MachineSchedule])
  @UseMiddleware(isAuth)
  async getMachScheduleByContract(
    @Arg('contract') contract: string
  ): Promise<MachineSchedule[] | undefined> {
    return await MachineSchedule.find({
      where: { contract },
      order: { scheduleId: 'ASC' }
    });
  }

  @Mutation(() => MachineSchedule)
  @UseMiddleware(isAuth)
  async createMachSchedule(
    @Arg('input') input: MachineScheduleInput
  ): Promise<MachineSchedule | null> {
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
      const result = await MachineSchedule.findOneBy({
        scheduleId: response[0].id
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineSchedule, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMachSchedule(
    @Arg('scheduleId') scheduleId: number,
    @Arg('input') input: MachineScheduleInput
  ): Promise<MachineSchedule | null> {
    try {
      const data = await MachineSchedule.findOneBy({ scheduleId });
      if (!data) throw new Error('No data found.');
      MachineSchedule.merge(data, { ...input });
      const result = await MachineSchedule.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MachineSchedule)
  @UseMiddleware(isAuth)
  async deleteMachSchedule(
    @Arg('scheduleId') scheduleId: number
  ): Promise<MachineSchedule> {
    try {
      const data = await MachineSchedule.findOneBy({ scheduleId });
      if (!data) throw new Error('No data found.');
      await MachineSchedule.delete({ scheduleId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
