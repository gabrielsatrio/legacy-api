import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { GraphQLDate, GraphQLDateTime } from '../../core/entities/scalars';

@Entity('ROB_APM_SCHEDULE_TASK_V')
@ObjectType()
export class MtcScheduleTaskView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ST_ID' })
  stId!: number;

  @Field()
  @Column({ name: 'SCHEDULE_ID' })
  scheduleId!: number;

  @Field()
  @Column({ name: 'PERIOD_ID' })
  periodId!: string;

  @Field({ nullable: true })
  @Column({ name: 'PERIOD' })
  period?: string;

  @Field(() => GraphQLDate)
  @Column({ name: 'PLAN_DATE' })
  planDate!: Date;

  @Field({ nullable: true })
  @Column({ name: 'PLAN_TIME' })
  planTime?: string;

  @Field({ nullable: true })
  @Column({ name: 'LATEST_EXEC_TIME' })
  latestExecTime?: string;

  @Field(() => GraphQLDateTime, { nullable: true })
  @Column({ name: 'REAL_DATE' })
  realDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'PERFORMED_BY' })
  performedBy?: string;

  @Field({ nullable: true })
  @Column({ name: 'PERSON_NAME' })
  personName?: string;

  @Field(() => GraphQLDateTime)
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field(() => GraphQLDateTime)
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
