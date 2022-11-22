import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { Material } from './ddp-material';

@Entity('CHR_DDT_MATERIAL_USE')
@ObjectType()
export class MaterialUse extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ID_NO' })
  idNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'ORDER_NO' })
  orderNo?: string;

  @Field()
  @Column({ name: 'TUBE_DYEING' })
  tubeDyeing!: string;

  @Field()
  @PrimaryColumn({ name: 'NO' })
  no!: number;

  @Field()
  @Column({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'LENGTH' })
  length!: number;

  @ManyToOne(() => Material, (material) => material.materialUses)
  @JoinColumn({ name: 'CONTRACT', referencedColumnName: 'contract' })
  @JoinColumn({ name: 'ID_NO', referencedColumnName: 'idNo' })
  material!: Material;

  @Field({ nullable: true })
  @Column({ name: 'LOT_BATCH_SOURCE' })
  lotBatchSource?: string;
}
