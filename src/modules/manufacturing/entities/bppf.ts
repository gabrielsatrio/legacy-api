import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_BPPF')
@ObjectType()
export class BPPF extends BaseEntity {
  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'TANGGAL' })
  tanggal?: Date;

  @Field()
  @Column({ name: 'DEPT' })
  dept!: string;

  @Field()
  @Column({ name: 'JENIS_BARANG' })
  jenisBarang!: string;

  @Field()
  @Column({ name: 'KODE_BARANG' })
  kodeBarang!: string;

  @Field()
  @Column({ name: 'NAMA_BARANG' })
  namaBarang!: string;

  @Field({ nullable: true })
  @Column({ name: 'NO_WARNA' })
  noWarna?: string;

  @Field({ nullable: true })
  @Column({ name: 'LOT' })
  lot?: string;

  @Field()
  @Column({ name: 'QUANTITY' })
  quantity!: number;

  @Field()
  @Column({ name: 'SATUAN' })
  satuan!: string;

  @Field({ nullable: true })
  @Column({ name: 'KETERANGAN' })
  keterangan?: string;

  @Field()
  @PrimaryColumn({ name: 'ID_NO' })
  idNo!: number;
}
