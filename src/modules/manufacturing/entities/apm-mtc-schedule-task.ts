import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_SCHEDULE_TASK')
@ObjectType()
export class MtcScheduleTask extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ST_ID' })
  stId!: number;

  @Field()
  @Column({ name: 'SCHEDULE_ID' })
  scheduleId!: number;

  @Field()
  @Column({ name: 'PERIOD_ID' })
  periodId!: string;

  @Field()
  @Column({ name: 'PLAN_DATE' })
  planDate!: Date;

  @Field({ nullable: true })
  @Column({ name: 'PLAN_TIME' })
  planTime?: string;

  @Field({ nullable: true })
  @Column({ name: 'LATEST_EXEC_TIME' })
  latestExecTime?: string;

  @Field({ nullable: true })
  @Column({ name: 'REAL_DATE' })
  realDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'PERFORMED_BY' })
  performedBy?: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
