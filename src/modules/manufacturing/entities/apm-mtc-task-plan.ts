import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_TASK_PLAN')
@ObjectType()
export class MtcTaskPlan extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'SCHEDULE_ID' })
  scheduleId!: number;

  @Field()
  @PrimaryColumn({ name: 'PERIOD_ID' })
  periodId!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'TASK_ID' })
  taskId!: string;

  @Field({ nullable: true })
  @Column({ name: 'TARGET_VALUE' })
  targetValue?: string;

  @Field({ nullable: true })
  @Column({ name: 'TARGET_LOW_VALUE' })
  targetLowValue?: number;

  @Field({ nullable: true })
  @Column({ name: 'TARGET_HIGH_VALUE' })
  targetHighValue?: number;

  @Field({ nullable: true })
  @Column({ name: 'OPTIONS' })
  options?: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
