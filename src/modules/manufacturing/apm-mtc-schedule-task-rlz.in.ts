import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class MtcScheduleTaskRlz implements Partial<MtcScheduleTaskRlz> {
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
