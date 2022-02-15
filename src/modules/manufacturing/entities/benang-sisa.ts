import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_BENANG_SISA')
@ObjectType()
export class BenangSisa extends BaseEntity {
  @Field({ nullable: true })
  @PrimaryColumn({ name: 'CONTRACT' })
  contract?: string;

  @Field({ nullable: true })
  @PrimaryColumn({ name: 'TANGGAL' })
  tanggal?: Date;

  @Field({ nullable: true })
  @PrimaryColumn({ name: 'NO_PALET' })
  noPalet?: string;

  @Field({ nullable: true })
  @PrimaryColumn({ name: 'NO_DUS' })
  noDus?: number;

  @Field()
  @Column({ name: 'JENIS_BARANG' })
  jenisBarang!: string;

  @Field({ nullable: true })
  @Column({ name: 'DENIER' })
  denier?: string;

  @Field()
  @Column({ name: 'JUMLAH_BOBIN' })
  jumlahBobin!: number;

  @Field({ nullable: true })
  @Column({ name: 'LOT' })
  lot?: string;

  @Field()
  @Column({ name: 'BRUTTO' })
  brutto!: number;

  @Field()
  @Column({ name: 'TARA' })
  tara!: number;

  @Field()
  @Column({ name: 'NETTO' })
  netto!: number;

  @Field({ nullable: true })
  @Column({ name: 'KETERANGAN' })
  keterangan?: string;

  @Field({ nullable: true })
  @Column({ name: 'ROW_ID' })
  rowId?: string;
}
