import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { GraphQLDateTime } from '../../core/entities/scalars';

@Entity('ROB_APM_SCHEDULE_V')
@ObjectType()
export class MtcScheduleView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'SCHEDULE_ID' })
  scheduleId!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'YEAR' })
  year!: string;

  @Field()
  @Column({ name: 'MACHINE_ID' })
  machineId!: string;

  @Field()
  @Column({ name: 'MACHINE' })
  machine!: string;

  @Field()
  @Column({ name: 'WORK_CENTER_NO' })
  workCenterNo!: string;

  @Field()
  @Column({ name: 'WORK_CENTER' })
  workCenter!: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field(() => GraphQLDateTime)
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field(() => GraphQLDateTime)
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
