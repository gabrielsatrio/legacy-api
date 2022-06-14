import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { GraphQLDateTime } from '../../core/entities/scalars';

@Entity('ROB_APM_SCHEDULE_TASK_RLZ_V')
@ObjectType()
export class MtcScheduleTaskRlzView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ST_ID' })
  stId!: number;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'TASK_ID' })
  taskId!: string;

  @Field({ nullable: true })
  @Column({ name: 'TASK' })
  task?: string;

  @Field({ nullable: true })
  @Column({ name: 'RESULT' })
  result?: string;

  @Field({ nullable: true })
  @Column({ name: 'THRESHOLD_STATUS' })
  thresholdStatus?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

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
