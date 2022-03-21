import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('CHR_KETERANGAN_LOST_TIME')
@ObjectType()
export class KeteranganLostTime extends BaseEntity {
  @Field({ nullable: true })
  @Column({ name: 'CONTRACT' })
  contract?: string;

  @Field()
  @Column({ name: 'LOST_TIME' })
  lostTime!: string;

  @Field()
  @Column({ name: 'TIPE' })
  tipe!: string;

  @Field()
  @Column({ name: 'ROW_ID' })
  rowId!: string;
}
