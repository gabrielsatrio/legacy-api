import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_PESANAN_SERAGAM')
@ObjectType()
export class PesananSeragam extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'NRP' })
  nrp!: string;

  @Field()
  @Column({ name: 'ID_JENIS' })
  idJenis!: number;

  @Field({ nullable: true })
  @Column({ name: 'UKURAN_KEMEJA' })
  ukuranKemeja?: string;

  @Field({ nullable: true })
  @Column({ name: 'UKURAN_CELANA' })
  ukuranCelana?: string;

  @Field()
  @Column({ name: 'JUMLAH_KEMEJA' })
  jumlahKemeja!: number;

  @Field()
  @Column({ name: 'JUMLAH_CELANA' })
  jumlahCelana!: number;

  @Field({ nullable: true })
  @Column({ name: 'KETERANGAN' })
  keterangan?: string;

  @Field()
  @Column({ name: 'TAHUN' })
  tahun!: string;

  @Field()
  @Column({ name: 'PERIODE' })
  periode!: number;

  @Field()
  @Column({ name: 'IS_LOCKED' })
  isLocked!: boolean;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
