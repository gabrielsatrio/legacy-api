import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_GIS_OPERATOR_V')
@ObjectType()
export class GisOperatorView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'INSPECT_ID' })
  inspectId!: number;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'EMPLOYEE_ID' })
  employeeId!: string;

  @Field()
  @Column({ name: 'EMPLOYEE_NAME' })
  employeeName!: string;

  @Field()
  @Column({ name: 'STARTING_METER' })
  startingMeter!: number;

  @Field()
  @Column({ name: 'FINAL_METER' })
  finalMeter!: number;

  @Field({ nullable: true })
  @Column({ name: 'DEFECT_ID' })
  defectId?: string;
}
