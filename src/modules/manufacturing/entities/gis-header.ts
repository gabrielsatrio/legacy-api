import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_GIS_HEADER')
@ObjectType()
export class GisHeader extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'INSPECT_ID' })
  inspectId!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'REPORT_DATE' })
  reportDate!: Date;

  @Field({ nullable: true })
  @Column({ name: 'ORDER_NO' })
  orderNo?: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'PIECE_NO' })
  pieceNo?: string;

  @Field()
  @Column({ name: 'WIDTH_ID' })
  widthId!: string;

  @Field()
  @Column({ name: 'KP_QTY' })
  kpQty!: number;

  @Field()
  @Column({ name: 'ACTUAL_QTY' })
  actualQty?: number;

  @Field({ nullable: true })
  @Column({ name: 'COLOR_1' })
  color1?: string;

  @Field({ nullable: true })
  @Column({ name: 'WEAVING_MC_1' })
  weavingMc1?: string;

  @Field({ nullable: true })
  @Column({ name: 'INSPECT_MC_14' })
  inspectMc14?: string;

  @Field({ nullable: true })
  @Column({ name: 'JUDGEMENT_1' })
  judgement1?: string;

  @Field({ nullable: true })
  @Column({ name: 'JOB_ORDER_4' })
  jobOrder4?: string;

  @Field({ nullable: true })
  @Column({ name: 'SHIFT_4' })
  shift4?: string;

  @Field({ nullable: true })
  @Column({ name: 'CATEGORY_4' })
  category4?: string;

  @Field({ nullable: true })
  @Column({ name: 'M2_QTY_4' })
  m2Qty4?: number;

  @Field({ nullable: true })
  @Column({ name: 'DEFECT_NAME_4' })
  defectName4?: string;

  @Field({ nullable: true })
  @Column({ name: 'SERI_BEAM' })
  seriBeam?: string;

  @Field({ nullable: true })
  @Column({ name: 'ROLL_NO' })
  rollNo?: number;

  @Field({ nullable: true })
  @Column({ name: 'INSPECT_TYPE' })
  inspectType?: string;

  @Field({ nullable: true })
  @Column({ name: 'LOT_BATCH_NO' })
  lotBatchNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'ACTUAL_WIDTH_1' })
  actualWidth1?: number;

  @Field({ nullable: true })
  @Column({ name: 'EMPLOYEE_ID' })
  employeeId?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field({ nullable: true })
  @Column({ name: 'MC_NO_2' })
  mcNo2?: string;

  @Field({ nullable: true })
  @Column({ name: 'SIDE_2' })
  side2?: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;
}
