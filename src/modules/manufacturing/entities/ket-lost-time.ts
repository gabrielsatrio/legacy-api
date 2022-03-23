import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_KETERANGAN_LOST_TIME')
@ObjectType()
export class KeteranganLostTime extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'LOST_TIME' })
  lostTime!: string;

  @Field()
  @Column({ name: 'TIPE' })
  tipe!: string;

  @Field({ nullable: true })
  @Column({ name: 'ROW_ID' })
  rowId?: string;
}
