import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_SERVICE_PR_MAP_V')
@ObjectType()
export class ServicePrMapView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQUISITION_NO' })
  requisitionNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: string;

  @Field()
  @PrimaryColumn({ name: 'RELEASE_NO' })
  releaseNo!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_NO' })
  partNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'DESCRIPTION' })
  description?: string;

  @Field({ nullable: true })
  @Column({ name: 'ORIGINAL_QTY' })
  originalQty?: number;

  @Field({ nullable: true })
  @Column({ name: 'UNIT_MEAS' })
  unitMeas?: string;

  @Field({ nullable: true })
  @Column({ name: 'WORK_CENTER' })
  workCenter?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;
}
