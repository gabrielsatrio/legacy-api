import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { GraphQLDateTime } from '../../core/entities/scalars';

@Entity('ROB_APM_SCHEDULE_DTL_V')
@ObjectType()
export class MtcScheduleDtlView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'SCHEDULE_ID' })
  scheduleId!: number;

  @Field()
  @PrimaryColumn({ name: 'PERIOD_ID' })
  periodId!: string;

  @Field()
  @Column({ name: 'PERIOD' })
  period!: string;

  @Field({ nullable: true })
  @Column({ name: 'D_DAY' })
  dDay?: string;

  @Field({ nullable: true })
  @Column({ name: 'D_START_TIME' })
  dStartTime?: string;

  @Field({ nullable: true })
  @Column({ name: 'D_END_TIME' })
  dEndTime?: string;

  @Field({ nullable: true })
  @Column({ name: 'D_TOLERANCE' })
  dTolerance?: number;

  @Field({ nullable: true })
  @Column({ name: 'D_INTERVAL' })
  dInterval?: number;

  @Field({ nullable: true })
  @Column({ name: 'PRD_START_MONTH' })
  prdStartMonth?: number;

  @Field({ nullable: true })
  @Column({ name: 'PRD_START_WEEK' })
  prdStartWeek?: number;

  @Field({ nullable: true })
  @Column({ name: 'PRD_START_DATE' })
  prdStartDate?: number;

  @Field(() => GraphQLDateTime)
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field(() => GraphQLDateTime)
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
