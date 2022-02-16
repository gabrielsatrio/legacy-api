import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_BENANG_SISA_DO')
@ObjectType()
export class BenangSisaDo extends BaseEntity {
  @Field({ nullable: true })
  @PrimaryColumn({ name: 'CONTRACT' })
  contract?: string;

  @Field({ nullable: true })
  @PrimaryColumn({ name: 'TANGGAL' })
  tanggal?: Date;

  @Field()
  @Column({ name: 'TOTAL_DO' })
  totalDo!: number;

  @Field({ nullable: true })
  @Column({ name: 'KETERANGAN' })
  keterangan?: string;

  @Field({ nullable: true })
  @Column({ name: 'ROW_ID' })
  rowId?: string;
}
