import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_GIS_OPERATOR')
@ObjectType()
export class GisOperator extends BaseEntity {
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
  @Column({ name: 'STARTING_METER' })
  startingMeter!: number;

  @Field()
  @Column({ name: 'FINAL_METER' })
  finalMeter!: number;

  @Field({ nullable: true })
  @Column({ name: 'DEFECT_ID' })
  defectId?: string;

  @Field({ nullable: true })
  @Column({ name: 'SHIFT' })
  shift?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;
}
