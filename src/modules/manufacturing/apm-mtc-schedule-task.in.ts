import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MtcScheduleTask } from './entities/apm-mtc-schedule-task';

@InputType()
export class MtcScheduleTaskInput implements Partial<MtcScheduleTask> {
  @Field()
  @IsNumber()
  scheduleId!: number;

  @Field()
  @MaxLength(4)
  periodId!: string;

  @Field()
  @IsDate()
  planDate!: Date;

  @Field({ nullable: true })
  @MaxLength(5)
  planTime?: string;

  @Field({ nullable: true })
  @MaxLength(5)
  latestExecTime?: string;

  @Field({ nullable: true })
  @IsDate()
  realDate?: Date;

  @Field({ nullable: true })
  @MaxLength(5)
  performedBy?: string;
}
