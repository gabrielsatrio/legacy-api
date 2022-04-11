import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { MachineView } from './apm-machine.vw';

@Entity('WORK_CENTER')
@ObjectType()
export class IfsWorkCenterView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'WORK_CENTER_NO' })
  workCenterNo!: string;

  @Field()
  @Column({ name: 'NOTE_ID' })
  noteId!: number;

  @Field()
  @Column({ name: 'UOM' })
  uom!: string;

  @Field()
  @Column({ name: 'CREATE_DATE' })
  createDate!: Date;

  @Field({ nullable: true })
  @Column({ name: 'CUM_DEVIATION' })
  cumDeviation?: number;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT_NO' })
  departmentNo?: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field({ nullable: true })
  @Column({ name: 'INPUT_HRS_WEEK' })
  inputHrsWeek?: number;

  @Field({ nullable: true })
  @Column({ name: 'INPUT_OUTPUT_CODE' })
  inputOutputCode?: string;

  @Field()
  @Column({ name: 'LAST_ACTIVITY_DATE' })
  lastActivityDate!: Date;

  @Field({ nullable: true })
  @Column({ name: 'OUTPUT_HRS_WEEK' })
  outputHrsWeek?: number;

  @Field()
  @Column({ name: 'QUEUE_TIME' })
  queueTime!: number;

  @Field({ nullable: true })
  @Column({ name: 'SOURCE' })
  source?: string;

  @Field({ nullable: true })
  @Column({ name: 'SCHED_CAPACITY' })
  schedCapacity?: string;

  @Field()
  @Column({ name: 'SCHED_CAPACITY_DB' })
  schedCapacityDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'WORK_CENTER_CODE' })
  workCenterCode?: string;

  @Field()
  @Column({ name: 'WORK_CENTER_CODE_DB' })
  workCenterCodeDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE_TEXT' })
  noteText?: string;

  @Field({ nullable: true })
  @Column({ name: 'USAGE_CODE' })
  usageCode?: string;

  @Field()
  @Column({ name: 'USAGE_CODE_DB' })
  usageCodeDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'PRODUCTION_LINE' })
  productionLine?: string;

  @Field()
  @Column({ name: 'UTILIZATION' })
  utilization!: number;

  @Field({ nullable: true })
  @Column({ name: 'SCHED_FINITE_LOCK' })
  schedFiniteLock?: string;

  @Field()
  @Column({ name: 'SCHED_FINITE_LOCK_DB' })
  schedFiniteLockDb!: string;

  @Field()
  @Column({ name: 'MAX_HOURS_PER_ORDER' })
  maxHoursPerOrder!: number;

  @Field()
  @Column({ name: 'UNITS_PER_DAYS' })
  unitsPerDays!: number;

  @Field()
  @Column({ name: 'RESOURCE_DAYS' })
  resourceDays!: number;

  @Field()
  @Column({ name: 'CALENDAR_ID' })
  calendarId!: string;

  @Field()
  @Column({ name: 'RRP_EFFICIENCY' })
  rrpEfficiency!: number;

  @Field()
  @Column({ name: 'AVERAGE_CAPACITY' })
  averageCapacity!: number;

  @Field()
  @Column({ name: 'COMPANY' })
  company!: string;

  @Field({ nullable: true })
  @Column({ name: 'CODE_PART' })
  codePart?: string;

  @Field({ nullable: true })
  @Column({ name: 'COST_CENTER_ID' })
  costCenterId?: string;

  @Field()
  @Column({ name: 'DEMONSTRATED_CAPACITY' })
  demonstratedCapacity!: number;

  @Field({ nullable: true })
  @Column({ name: 'OUTSIDE_OP_BACKFLUSH' })
  outsideOpBackflush?: string;

  @Field()
  @Column({ name: 'OUTSIDE_OP_BACKFLUSH_DB' })
  outsideOpBackflushDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'VENDOR_NO' })
  vendorNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'ALLOW_CONC_OPERATIONS' })
  allowConcOperations?: string;

  @Field()
  @Column({ name: 'ALLOW_CONC_OPERATIONS_DB' })
  allowConcOperationsDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'AUTO_STOP_MACH_CLOCKING' })
  autoStopMachClocking?: string;

  @Field()
  @Column({ name: 'AUTO_STOP_MACH_CLOCKING_DB' })
  autoStopMachClockingDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'RECEIVE_ON_LAST_OPER' })
  receiveOnLastOper?: string;

  @Field()
  @Column({ name: 'RECEIVE_ON_LAST_OPER_DB' })
  receiveOnLastOperDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'BASIS_FOR_REMAIN_OP_HOURS' })
  basisForRemainOpHours?: string;

  @Field()
  @Column({ name: 'BASIS_FOR_REMAIN_OP_HOURS_DB' })
  basisForRemainOpHoursDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_REPORT_BY_PICK' })
  ctmReportByPick?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_SPEED' })
  ctmSpeed?: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_FAKTOR_PERKALIAN' })
  ctmFaktorPerkalian?: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_JUMLAH_SPINDLE' })
  ctmJumlahSpindle?: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_RESOURCE_QTY' })
  ctmResourceQty?: number;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;

  @Field()
  @Column({ name: 'OBJVERSION' })
  objVersion!: string;

  @Field()
  @Column({ name: 'OBJKEY' })
  objKey!: string;

  @Field()
  altDescription(): string {
    return `${this.description} (${this.workCenterNo})`;
  }

  @Field(() => MachineView, { nullable: true })
  @ManyToOne(() => MachineView, (machine) => machine.workCenters, {
    nullable: true
  })
  @JoinColumn({ name: 'CONTRACT', referencedColumnName: 'contract' })
  @JoinColumn({ name: 'WORK_CENTER_NO', referencedColumnName: 'workCenterNo' })
  machines?: MachineView;
}
