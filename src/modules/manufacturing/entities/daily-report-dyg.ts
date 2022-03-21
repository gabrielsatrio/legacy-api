import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_DAILY_REPORT_DYG')
@ObjectType()
export class DailyReportDyg extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ROW_ID' })
  rowId!: number;
  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'TANGGAL' })
  tanggal!: Date;

  @Field({ nullable: true })
  @Column({ name: 'LOT_DYEING' })
  lotDyeing?: string;

  @Field()
  @Column({ name: 'START_HOUR' })
  startHour!: number;

  @Field()
  @Column({ name: 'END_HOUR' })
  endHour!: number;

  @Field()
  @Column({ name: 'DURASI_HOUR' })
  durasiHour!: number;

  @Field()
  @Column({ name: 'AKTIVITAS' })
  aktivitas!: string;

  @Field({ nullable: true })
  @Column({ name: 'MESIN' })
  mesin?: string;

  @Field({ nullable: true })
  @Column({ name: 'BERAT_BAHAN' })
  beratBahan?: number;

  @Field({ nullable: true })
  @Column({ name: 'ACTUAL_METER' })
  actualMeter?: number;

  @Field({ nullable: true })
  @Column({ name: 'LOSS_INT' })
  lossInt?: number;

  @Field({ nullable: true })
  @Column({ name: 'LOSS_EXT' })
  lossExt?: number;

  @Field({ nullable: true })
  @Column({ name: 'JENIS_LOSS' })
  jenisLoss?: string;

  @Field({ nullable: true })
  @Column({ name: 'TIPE_LOSS' })
  tipeLoss?: string;

  @Field({ nullable: true })
  @Column({ name: 'TARGET_DESIGN' })
  targetDesign?: string;

  @Field({ nullable: true })
  @Column({ name: 'TARGET_WAKTU' })
  targetWaktu?: number;

  @Field({ nullable: true })
  @Column({ name: 'TARGET_METER' })
  targetMeter?: number;

  @Field({ nullable: true })
  @Column({ name: 'SERAH_TERIMA' })
  serahTerima?: string;

  @Field({ nullable: true })
  @Column({ name: 'QTY_LOSS_TIME' })
  qtyLossTime?: number;

  @Field({ nullable: true })
  @Column({ name: 'OPT_KARU' })
  optKaru?: string;

  @Field({ nullable: true })
  @Column({ name: 'JUDGEMENT' })
  judgement?: string;

  @Field({ nullable: true })
  @Column({ name: 'AUX_USE' })
  auxUse?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field({ nullable: true })
  @Column({ name: 'AIR' })
  air?: number;
}
