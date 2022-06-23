import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_PROD_STRUCTURE_V')
@ObjectType()
export class IfsProdStructureView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'OBJID' })
  objId!: string;

  @Field()
  @Column({ name: 'LINE_ITEM_NO' })
  lineItemNo!: number;

  @Field()
  @Column({ name: 'COMPONENT_PART' })
  componentPart!: string;

  @Field()
  @Column({ name: 'COMP_DESC' })
  componentDesc!: string;

  @Field()
  @Column({ name: 'QTY_PER_ASSEMBLY' })
  qtyPerAssembly!: number;

  @Field()
  @Column({ name: 'COMPONENT_SCRAP' })
  componentScrap!: number;

  @Field()
  @Column({ name: 'SHRINKAGE_FACTOR' })
  shrinkageFactor!: number;

  @Field()
  @Column({ name: 'ALTERNATIVE_NO' })
  alternativeNo!: string;
}
