import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MtcScheduleDtl } from './entities/apm-mtc-schedule-dtl';

@InputType()
export class MtcScheduleDtlInput implements Partial<MtcScheduleDtl> {
  @Field()
  @IsNumber()
  scheduleId!: number;

  @Field()
  @MaxLength(4)
  periodId!: string;

  @Field({ nullable: true })
  @MaxLength(15)
  dDay?: string;

  @Field({ nullable: true })
  @MaxLength(5)
  dStartTime?: string;

  @Field({ nullable: true })
  @MaxLength(5)
  dEndTime?: string;

  @Field({ nullable: true })
  @IsNumber()
  dTolerance?: number;

  @Field({ nullable: true })
  @IsNumber()
  dInterval?: number;

  @Field({ nullable: true })
  @IsNumber()
  prdStartMonth?: number;

  @Field({ nullable: true })
  @IsNumber()
  prdStartWeek?: number;

  @Field({ nullable: true })
  @IsNumber()
  prdStartDate?: number;
}
