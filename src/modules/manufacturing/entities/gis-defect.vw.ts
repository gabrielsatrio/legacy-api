import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_GIS_DEFECT_V')
@ObjectType()
export class GisDefectView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'DEFECT_ID' })
  defectId!: string;

  @Field()
  @Column({ name: 'DEFECT_DESCRIPTION' })
  defectDescription!: string;

  @Field()
  @Column({ name: 'DEFECT_LIST' })
  defectList!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;
}
