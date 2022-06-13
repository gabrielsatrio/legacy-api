import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MtcSchedule } from './entities/apm-mtc-schedule';

@InputType()
export class MtcScheduleInput implements Partial<MtcSchedule> {
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
  status!: 'Planned' | 'Released';
}
