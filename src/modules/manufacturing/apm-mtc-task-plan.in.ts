import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MtcTaskPlan } from './entities/apm-mtc-task-plan';

@InputType()
export class MtcTaskPlanInput implements Partial<MtcTaskPlan> {
  @Field()
  @MaxLength(5)
  taskId!: string;

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
