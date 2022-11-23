import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_DDP_DEFECT_LIST')
@ObjectType()
export class DefectList extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'DEFECT_ID' })
  defectId!: string;

  @Field()
  @Column({ name: 'DEFECT_NAME' })
  defectName!: string;
}
