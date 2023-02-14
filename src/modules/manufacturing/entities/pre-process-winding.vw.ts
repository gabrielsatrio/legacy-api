import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_PRE_PROCESS_WINDING_V')
@ObjectType()
export class PreProcessWindingView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'PIECE_NO' })
  pieceNo?: string;

  @Field()
  @Column({ name: 'GROSS' })
  gross!: number;

  @Field()
  @Column({ name: 'NETT' })
  nett!: number;

  @Field({ nullable: true })
  @Column({ name: 'JOB_ORDER' })
  jobOrder?: string;

  @Field()
  @Column({ name: 'SCAN_DATE' })
  scanDate!: Date;

  @Field()
  @Column({ name: 'OBJID' })
  objid!: string;
}
