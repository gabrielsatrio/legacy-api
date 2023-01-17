import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { SparePartMrMapView } from './apm-spare-part-mr-map.vw';

@Entity('ROB_APM_MAINTENANCE_V')
@ObjectType()
export class MachineMaintenanceView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'MAINTENANCE_ID' })
  maintenanceId!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'MACHINE_ID' })
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

  @Field({ nullable: true })
  @Column({ name: 'MAKER_ID' })
  makerId?: string;

  @Field({ nullable: true })
  @Column({ name: 'MAKER' })
  maker?: string;

  @Field({ nullable: true })
  @Column({ name: 'YEAR_MADE' })
  yearMade?: number;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT_ID' })
  departmentId?: string;

  @Field()
  @Column({ name: 'MAINTENANCE_DATE' })
  maintenanceDate!: Date;

  @Field()
  @Column({ name: 'CATEGORY_ID' })
  categoryId!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'PART_DESCRIPTION' })
  partDescription!: string;

  @Field()
  @Column({ name: 'QUANTITY' })
  quantity!: number;

  @Field()
  @Column({ name: 'UNIT_MEAS' })
  unitMeas!: string;

  @Field()
  @Column({ name: 'DURATION' })
  duration!: number;

  @Field()
  @Column({ name: 'PERFORMED_BY' })
  performedBy!: string;

  @Field()
  @Column({ name: 'PERSON_NAME' })
  personName!: string;

  @Field({ nullable: true })
  @Column({ name: 'MR_NO' })
  mrNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'MR_LINE_NO' })
  mrLineNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'MR_RELEASE_NO' })
  mrReleaseNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'MR_LINE_ITEM_NO' })
  mrLineItemNo?: number;

  @Field({ nullable: true })
  @Column({ name: 'MR_ORDER_CLASS' })
  mrOrderClass?: string;

  @Field({ nullable: true })
  @Column({ name: 'MR_DELIVERY_DATE' })
  mrDeliveryDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'PR_NO' })
  prNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PR_LINE_NO' })
  prLineNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PR_RELEASE_NO' })
  prReleaseNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PO_NO' })
  poNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PO_LINE_NO' })
  poLineNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PO_RELEASE_NO' })
  poReleaseNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'COST' })
  cost?: number;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;

  @Field(() => SparePartMrMapView, { nullable: true })
  @ManyToOne(
    () => SparePartMrMapView,
    (SparePartMrMapView) => SparePartMrMapView.maintenanceLogs,
    {
      nullable: true
    }
  )
  @JoinColumn({ name: 'CONTRACT', referencedColumnName: 'contract' })
  @JoinColumn({ name: 'MACHINE_ID', referencedColumnName: 'machineId' })
  @JoinColumn({ name: 'MR_NO', referencedColumnName: 'orderNo' })
  @JoinColumn({ name: 'MR_LINE_NO', referencedColumnName: 'lineNo' })
  @JoinColumn({ name: 'MR_RELEASE_NO', referencedColumnName: 'releaseNo' })
  @JoinColumn({ name: 'MR_LINE_ITEM_NO', referencedColumnName: 'lineItemNo' })
  @JoinColumn({ name: 'MR_ORDER_CLASS', referencedColumnName: 'orderClass' })
  sparePartMrMaps?: SparePartMrMapView;
}
