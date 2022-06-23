import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MtcScheduleTaskRlz } from './entities/apm-mtc-schedule-task-rlz';

@InputType()
export class MtcScheduleTaskRlzInput implements Partial<MtcScheduleTaskRlz> {
  @Field()
  @IsNumber()
  stId!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @MaxLength(5)
  taskId!: string;

  @Field({ nullable: true })
  @MaxLength(500)
  result?: string;

  @Field({ nullable: true })
  @MaxLength(10)
  thresholdStatus?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  note?: string;

  @Field({ nullable: true })
  @MaxLength(5)
  performedBy?: string;
}
