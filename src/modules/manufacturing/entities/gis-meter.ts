import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_GIS_METER')
@ObjectType()
export class GisMeter extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'INSPECT_ID' })
  inspectId!: number;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'STARTING_METER' })
  startingMeter!: number;

  @Field()
  @Column({ name: 'FINAL_METER' })
  finalMeter!: number;

  @Field()
  @Column({ name: 'DEFECT_ID' })
  defectId!: string;

  @Field()
  @Column({ name: 'POSITION' })
  position!: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field({ nullable: true })
  @Column({ name: 'INSPECT_ORDER' })
  inspectOrder?: number;

  @Field({ nullable: true })
  @Column({ name: 'ADDITIONAL_NOTES' })
  additionalNotes?: string;
}
