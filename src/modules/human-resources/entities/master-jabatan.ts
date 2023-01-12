import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_MASTER_JABATAN')
@ObjectType()
export class MasterJabatan extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'KODE' })
  kode!: string;

  @Field()
  @Column({ name: 'JABATAN' })
  jabatan!: string;
}
