import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn
} from 'typeorm';

@Entity('CHR_DDT_MASTER_RESEP_TAB')
@ObjectType()
export class MasterResep extends BaseEntity {
  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'ALTERNATE' })
  alternate!: number;

  @Field({ nullable: true })
  @Column({ name: 'PROGRAM_NO' })
  programNo?: string;

  @Field({ nullable: true })
  @CreateDateColumn({ name: 'TANGGAL_CELUP' })
  tanggalCelup!: Date;

  @Field()
  @Column({ name: 'JENIS' })
  jenis!: string;

  @Field()
  @Column({ name: 'COMPONENT_PART' })
  componentPart!: string;

  @Field()
  @Column({ name: 'DESKRIPSI' })
  deskripsi!: string;

  @Field()
  @Column({ name: 'RESEP' })
  resep!: number;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @PrimaryColumn({ name: 'SEQ_ID' })
  seqId!: number;
}
