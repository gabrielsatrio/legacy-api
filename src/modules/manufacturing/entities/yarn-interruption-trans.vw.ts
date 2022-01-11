import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_YARN_INTERRUPTION_TRANS_V')
@ObjectType()
export class YarnInterruptionTransView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'MACHINE' })
  machine!: string;

  @Field()
  @Column({ name: 'INTERRUPTION_ID' })
  interruptionId!: string;

  @Field()
  @Column({ name: 'INTERRUPTION' })
  interruption!: string;

  @Field()
  @Column({ name: 'FREQ' })
  freq!: number;

  @Field()
  @Column({ name: 'DURATION_MINUTE' })
  durationMinute!: number;

  @Field()
  @Column({ name: 'YARN_TYPE' })
  yarnType!: string;

  @Field()
  @Column({ name: 'REPORT_DATE' })
  reportDate!: Date;
}
