import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MachineMaintenanceView } from './apm-machine-maintenance.vw';

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

  @Field()
  @Column({ name: 'MACHINE' })
  machine!: string;

  @Field()
  @Column({ name: 'WORK_CENTER_NO' })
  workCenterNo!: string;

  @Field()
  @Column({ name: 'WORK_CENTER' })
  workCenter!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT_ID' })
  departmentId?: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT' })
  department?: string;

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

  @Field({ nullable: true })
  @Column({ name: 'DESTINATION_ID' })
  destinationId?: string;

  @Field({ nullable: true })
  @Column({ name: 'DESTINATION' })
  destination?: string;

  @Field({ defaultValue: false })
  @Column({ name: 'NON_KS' })
  nonKS!: boolean;

  @Field()
  @Column({ name: 'UNUSED_QTY' })
  unusedQty!: number;

  @Field()
  @Column({ name: 'UNIT_MEAS' })
  unusedQtyUnitMeas!: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;

  @Field()
  altMachineDesc(): string {
    return `${this.machine} (${this.machineId})`;
  }

  @Field()
  altWorkCenterDesc(): string {
    return `${this.workCenter} (${this.workCenterNo})`;
  }

  @Field(() => [MachineMaintenanceView], { nullable: true })
  @OneToMany(
    () => MachineMaintenanceView,
    (MachineMaintenanceView) => MachineMaintenanceView.sparePartMrMaps
  )
  maintenanceLogs?: MachineMaintenanceView[];
}
