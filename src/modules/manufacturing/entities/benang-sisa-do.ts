import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('CHR_BENANG_SISA_DO')
@ObjectType()
export class BenangSisaDo extends BaseEntity {
  @Field({ nullable: true })
  @Column({ name: 'CONTRACT' })
  contract?: string;

  @Field({ nullable: true })
  @Column({ name: 'TANGGAL' })
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
