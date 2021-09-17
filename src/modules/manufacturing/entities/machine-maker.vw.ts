import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_MAP_PART_BRAND')
@ObjectType()
export class MachineMakerView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'PART_CODE' })
  partCode!: string;

  @Field()
  @PrimaryColumn({ name: 'BRAND_CODE' })
  makerId!: string;

  @Field()
  @Column({ name: 'BRAND_NOTES' })
  name!: string;
}
