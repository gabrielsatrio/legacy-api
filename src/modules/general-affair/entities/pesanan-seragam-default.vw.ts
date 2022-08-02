import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_DEFAULT_SERAGAM_V')
@ObjectType()
export class DefaultSeragamView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'JENIS' })
  jenis!: string;

  @Field()
  @Column({ name: 'TAHUN' })
  tahun!: string;

  @Field()
  @Column({ name: 'PERIODE' })
  periode!: number;

  @Field()
  @Column({ name: 'JUMLAH_KEMEJA' })
  jumlahKemeja!: number;

  @Field()
  @Column({ name: 'JUMLAH_CELANA' })
  jumlahCelana!: number;

  @Field()
  @Column({ name: 'IS_LOCKED' })
  isLocked!: boolean;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
