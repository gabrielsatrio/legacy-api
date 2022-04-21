import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { TransportTaskHead } from './tt-header';

@Entity('ATJ_TRANSPORT_TASK_BODY')
@ObjectType()
export class TransportTaskBody extends BaseEntity {
  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'TRANSPORT_TASK_ID' })
  transportTaskId!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field()
  @Column({ name: 'QTY' })
  qty!: number;

  @Field()
  @PrimaryColumn({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @Column({ name: 'RECEIPT_DATE' })
  receiptDate!: Date;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;

  @ManyToOne(
    () => TransportTaskHead,
    (TransportTaskHead) => TransportTaskHead.details
  )
  @JoinColumn({ name: 'CONTRACT', referencedColumnName: 'contract' })
  @JoinColumn({
    name: 'TRANSPORT_TASK_ID',
    referencedColumnName: 'transportTaskId'
  })
  head!: TransportTaskHead;
}
