import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_MR_SPAREPART_MAP_V')
@ObjectType()
export class SparePartMrMapView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: string;

  @Field()
  @PrimaryColumn({ name: 'RELEASE_NO' })
  releaseNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_ITEM_NO' })
  lineItemNo!: number;

  @Field()
  @PrimaryColumn({ name: 'ORDER_CLASS' })
  orderClass!: string;

  @Field()
  @PrimaryColumn({ name: 'MACHINE_ID' })
  machineId!: string;

  @Field({ nullable: true })
  @Column({ name: 'MACHINE' })
  machine?: string;

  @Field({ nullable: true })
  @Column({ name: 'WORK_CENTER_NO' })
  workCenterNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'WORK_CENTER' })
  workCenter?: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'PART' })
  part?: string;

  @Field({ nullable: true })
  @Column({ name: 'QUANTITY' })
  quantity?: number;

  @Field({ nullable: true })
  @Column({ name: 'UNIT_MEAS' })
  unitMeas?: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @Field({ nullable: true })
  @Column({ name: 'MAINTENANCE_DESCRIPTION' })
  maintenanceDescription?: string;

  @Field({ nullable: true })
  @Column({ name: 'MAINTENANCE_DATE' })
  maintenanceDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'PERFORMED_BY' })
  performedBy?: string;

  @Field({ nullable: true })
  @Column({ name: 'NAME' })
  name?: string;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;
}
