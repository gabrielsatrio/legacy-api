import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MtcTaskPlan } from './entities/apm-mtc-task-plan';

@InputType()
export class MtcTaskPlanCreateInput implements Partial<MtcTaskPlan> {
  @Field()
  @IsNumber()
  scheduleId!: number;

  @Field()
  @MaxLength(4)
  periodId!: string;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  task!: string;

  @Field()
  type!: 'THRESHOLD' | 'NOTE' | 'OPTION';

  @Field()
  uom!: string;

  @Field({ nullable: true })
  @MaxLength(500)
  targetValue?: string;

  @Field({ nullable: true })
  @IsNumber()
  targetLowValue?: number;

  @Field({ nullable: true })
  @IsNumber()
  targetHighValue?: number;

  @Field({ nullable: true })
  @MaxLength(500)
  options?: string;
}
