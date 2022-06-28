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

  @Field({ nullable: true })
  @Column({ name: 'OPERATOR_ID' })
  operatorId?: string;

  @Field({ nullable: true })
  @Column({ name: 'STARTING_METER' })
  startingMeter?: number;

  @Field({ nullable: true })
  @Column({ name: 'FINAL_METER' })
  finalMeter?: number;
}
