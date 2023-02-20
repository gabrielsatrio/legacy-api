import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_KASBON_V')
@ObjectType()
export class KasbonView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DEPARTMENT' })
  department!: string;

  @Field()
  @Column({ name: 'KATEGORI' })
  kategori!: string;

  @Field()
  @Column({ name: 'NOMOR_PO' })
  nomorPo!: string;

  @Field()
  @Column({ name: 'JUMLAH' })
  jumlah!: number;

  @Field()
  @Column({ name: 'TERBILANG' })
  terbilang!: string;

  @Field()
  @Column({ name: 'KEPERLUAN' })
  keperluan!: string;

  @Field()
  @Column({ name: 'TGL_PERTANGGUNGJAWABAN' })
  tglPertanggungjawaban!: Date;

  @Field()
  @Column({ name: 'PEMBAYARAN' })
  pembayaran!: string;

  @Field({ nullable: true })
  @Column({ name: 'BANK' })
  bank?: string;

  @Field({ nullable: true })
  @Column({ name: 'NAMA_REKENING' })
  namaRekening?: string;

  @Field({ nullable: true })
  @Column({ name: 'NO_REKENING' })
  noRekening?: string;

  @Field({ nullable: true })
  @Column({ name: 'TGL_TRANSFER' })
  tglTransfer?: Date;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'APPR_ATASAN' })
  apprAtasan!: string;

  @Field()
  @Column({ name: 'APPR_ATASAN_STATUS' })
  apprAtasanStatus!: string;

  @Field()
  @Column({ name: 'APPR_KAS' })
  apprKas!: string;

  @Field()
  @Column({ name: 'APPR_KAS_STATUS' })
  apprKasStatus!: string;

  @Field({ nullable: true })
  @Column({ name: 'APPR_BANK' })
  apprBank?: string;

  @Field({ nullable: true })
  @Column({ name: 'APPR_BANK_STATUS' })
  apprBankStatus?: string;
}
