import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MachineSchedule } from './entities/apm-machine-schedule';

@InputType()
export class MachineScheduleInput implements Partial<MachineSchedule> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(4)
  year!: string;

  @Field()
  @MaxLength(6)
  machineId!: string;

  @Field()
  @MaxLength(5)
  workCenterNo!: string;

  @Field()
  @MaxLength(10)
  status!: string;
}
