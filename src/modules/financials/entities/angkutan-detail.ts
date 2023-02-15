import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_ANGKUTAN_DTL')
@ObjectType()
export class AngkutanDetail extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'BULAN' })
  bulan?: string;

  @Field({ nullable: true })
  @Column({ name: 'CONTRACT' })
  contract?: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPT' })
  dept?: string;

  @Field({ nullable: true })
  @Column({ name: 'JASA_KIRIM' })
  jasaKirim?: number;

  @Field({ nullable: true })
  @Column({ name: 'JASA_KIRIM_INC_PPN' })
  jasaKirimIncPpn?: number;

  @Field({ nullable: true })
  @Column({ name: 'NAMA_ANGKUTAN' })
  namaAngkutan?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field({ nullable: true })
  @Column({ name: 'NO_ACCOUNT' })
  noAccount?: string;

  @Field({ nullable: true })
  @Column({ name: 'NO_POLISI' })
  noPolisi?: string;

  @Field({ nullable: true })
  @Column({ name: 'NO_RESI' })
  noResi?: string;

  @Field({ nullable: true })
  @Column({ name: 'OTHER' })
  other?: string;

  @Field({ nullable: true })
  @Column({ name: 'PERIODE' })
  periode?: string;

  @Field({ nullable: true })
  @Column({ name: 'PILIH' })
  pilih?: string;

  @Field({ nullable: true })
  @Column({ name: 'PPN' })
  ppn?: number;

  @Field({ nullable: true })
  @Column({ name: 'TAHUN' })
  tahun?: string;

  @Field({ nullable: true })
  @Column({ name: 'TGL_MUAT' })
  tglMuat?: Date;

  @Field({ nullable: true })
  @Column({ name: 'UPLOAD' })
  upload?: string;

  @Field({ nullable: true })
  @Column({ name: 'VOUCHER_NO' })
  voucherNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'VOUCHER_NO_TEMP' })
  voucherNoTemp?: string;

  @Field()
  @Column({ name: 'ANGKUTAN_ID' })
  angkutanId!: number;
}
