import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TransportTaskBody } from './tt-detail';

@Entity('ATJ_TRANSPORT_TASK_HEAD')
@ObjectType()
export class TransportTaskHead extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'TRANSPORT_TASK_ID' })
  transportTaskId!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'CREATED' })
  created!: Date;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'LOCATION_TO' })
  locationTo!: string;

  @Field(() => [TransportTaskBody], { nullable: true })
  @OneToMany(
    () => TransportTaskBody,
    (TransportTaskBody) => TransportTaskBody.head,
    {
      nullable: true
    }
  )
  details?: TransportTaskBody[];
}
