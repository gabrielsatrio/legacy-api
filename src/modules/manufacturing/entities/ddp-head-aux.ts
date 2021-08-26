import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { HeadResep } from './ddp-head-resep';

@Entity('CHR_DDT_MASTER_RESEP_AUX')
@ObjectType()
export class HeadAux extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ALTERNATE' })
  alternate!: number;

  @Field()
  @Column({ name: 'COMPONENT_PART' })
  componentPart!: string;

  @Field()
  @Column({ name: 'DESKRIPSI' })
  deskripsi!: string;

  @Field()
  @Column({ name: 'RESEP' })
  resep!: number;

  @Field()
  @PrimaryColumn({ name: 'NO' })
  no!: number;

  @Field({ nullable: true })
  @Column({ name: 'ID_TABLE' })
  idTable?: string;

  @ManyToOne(() => HeadResep, (headResep) => headResep.headAuxs)
  @JoinColumn({ name: 'CONTRACT', referencedColumnName: 'contract' })
  @JoinColumn({ name: 'PART_NO', referencedColumnName: 'partNo' })
  @JoinColumn({ name: 'ALTERNATE', referencedColumnName: 'alternate' })
  headResep!: HeadResep;
}
