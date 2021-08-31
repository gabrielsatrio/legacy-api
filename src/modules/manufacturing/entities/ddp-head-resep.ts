import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { HeadAux } from './ddp-head-aux';
import { HeadDye } from './ddp-head-dye';

@Entity('CHR_DDT_MASTER_RESEP')
@ObjectType()
export class HeadResep extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field(() => Int)
  @PrimaryColumn({ name: 'ALTERNATE' })
  alternate!: number;

  @Field({ nullable: true })
  @Column({ name: 'PROGRAM_NO' })
  programNo?: string;

  @Field({ nullable: true })
  @CreateDateColumn({ name: 'TANGGAL_CELUP' })
  tanggalCelup!: Date;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field({ nullable: true })
  @Column({ name: 'STATUS' })
  status?: string;

  @Field({ nullable: true })
  @Column({ name: 'ID_TABLE' })
  idTable?: string;

  @Field(() => [HeadDye], { nullable: true })
  @OneToMany(() => HeadDye, (headDye) => headDye.headResep, {
    nullable: true
  })
  headDyes?: HeadDye[];

  @Field(() => [HeadAux], { nullable: true })
  @OneToMany(() => HeadAux, (headAux) => headAux.headResep, {
    nullable: true
  })
  headAuxs?: HeadAux[];
}
