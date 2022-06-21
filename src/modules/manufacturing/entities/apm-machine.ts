import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn
} from 'typeorm';
import { GraphQLDate } from '../../core/entities/scalars';
import { MachineCategory } from './apm-machine-category';

@Entity('ROB_APM_MACHINE')
@ObjectType()
export class Machine extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'MACHINE_ID' })
  machineId!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'CATEGORY_ID' })
  categoryId!: string;

  @Field()
  @Column({ name: 'TYPE' })
  type!: string;

  @Field()
  @Column({ name: 'MAKER_ID' })
  makerId!: string;

  @Field()
  @Column({ name: 'SERIAL_NO' })
  serialNo!: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'YEAR_MADE' })
  yearMade?: number;

  @Field(() => GraphQLDate)
  @Column({ name: 'PURCHASE_DATE' })
  purchaseDate!: Date;

  @Field()
  @Column({ name: 'DEPARTMENT_ID' })
  departmentId!: string;

  @Field({ nullable: true })
  @Column({ name: 'WORK_CENTER_NO' })
  workCenterNo?: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field({ nullable: true })
  @Column({ name: 'IMAGE_1' })
  image1?: string;

  @Field({ nullable: true })
  @Column({ name: 'IMAGE_2' })
  image2?: string;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_SPINDLE' })
  totalSpindle?: number;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_MAX_CREEL' })
  totalMaxCreel?: number;

  @Field({ nullable: true })
  @Column({ name: 'CONTROLLER_TYPE' })
  controllerType?: string;

  @Field({ nullable: true })
  @Column({ name: 'OILING_DEVICE' })
  oilingDevice?: string;

  @Field({ nullable: true })
  @Column({ name: 'CONTROLLER' })
  controller?: string;

  @Field({ nullable: true })
  @Column({ name: 'LAUNCH_METHOD' })
  launchMethod?: string;

  @Field({ nullable: true })
  @Column({ name: 'RAPIER_TYPE' })
  rapierType?: string;

  @Field({ nullable: true })
  @Column({ name: 'WIDTH_IN_CM' })
  widthInCm?: number;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_ACCUMULATOR' })
  totalAccumulator?: number;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_SELECTOR' })
  totalSelector?: number;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_HARNESS' })
  totalHarness?: number;

  @Field({ nullable: true })
  @Column({ name: 'END_CAPACITY' })
  endCapacity?: number;

  @Field({ nullable: true })
  @Column({ name: 'GANG' })
  gang?: string;

  @Field({ nullable: true })
  @Column({ name: 'GAUGE' })
  gauge?: string;

  @Field({ nullable: true })
  @Column({ name: 'FEEDER' })
  feeder?: number;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_NEEDLES' })
  totalNeedles?: number;

  @Field({ nullable: true })
  @Column({ name: 'YARN_FEEDER_TYPE' })
  yarnFeederType?: string;

  @Field({ nullable: true })
  @Column({ name: 'NEEDLE_SENSOR' })
  needleSensor?: string;

  @Field({ nullable: true })
  @Column({ name: 'CAPACITY_IN_M' })
  capacityInM?: number;

  @Field({ nullable: true })
  @Column({ name: 'CAPACITY_IN_KG' })
  capacityInKg?: number;

  @Field({ nullable: true })
  @Column({ name: 'SETTING_SYSTEM' })
  settingSystem?: string;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_CHAMBER' })
  totalChamber?: number;

  @Field({ nullable: true })
  @Column({ name: 'USABLE_WIDTH' })
  usableWidth?: number;

  @Field({ nullable: true })
  @Column({ name: 'NOMINAL_WIDTH' })
  nominalWidth?: number;

  @Field({ nullable: true })
  @Column({ name: 'POSITION' })
  position?: string;

  @Field({ nullable: true })
  @Column({ name: 'CAPACITY' })
  capacity?: string;

  @Field({ nullable: true })
  @Column({ name: 'STEAM_CAPACITY' })
  steamCapacity?: string;

  @Field({ nullable: true })
  @Column({ name: 'HEAT_CAPACITY' })
  heatCapacity?: string;

  @Field({ nullable: true })
  @Column({ name: 'MAX_WORKING_PRESSURE' })
  maxWorkingPressure?: string;

  @Field({ nullable: true })
  @Column({ name: 'FREE_AIR_DELIVERY' })
  freeAirDelivery?: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @Field(() => MachineCategory)
  @OneToOne(() => MachineCategory)
  @JoinColumn({ name: 'CATEGORY_ID', referencedColumnName: 'categoryId' })
  category!: MachineCategory;
}
