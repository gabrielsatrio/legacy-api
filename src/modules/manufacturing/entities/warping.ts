import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_PROD_WARPING')
@ObjectType()
export class ProdWarping extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'CONTRACT' })
  contract?: string;

  @Field()
  @Column({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_NO' })
  partNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_DESC' })
  partDesc?: string;

  @Field()
  @Column({ name: 'TGL_PROD' })
  tglProd!: Date;

  @Field()
  @Column({ name: 'SHIFT' })
  shift!: string;

  @Field()
  @Column({ name: 'MACHINE_ID' })
  machineId!: string;

  @Field({ nullable: true })
  @Column({ name: 'JOB_ORDER_1' })
  jobOrder1?: string;

  @Field({ nullable: true })
  @Column({ name: 'DESIGN_1' })
  design1?: string;

  @Field({ nullable: true })
  @Column({ name: 'QTY_M_1' })
  qtyM1?: number;

  @Field({ nullable: true })
  @Column({ name: 'SERI_BEAM_1' })
  seriBeam1?: string;

  @Field({ nullable: true })
  @Column({ name: 'SEGMEN' })
  segmen?: string;

  @Field({ nullable: true })
  @Column({ name: 'JUMLAH_LUSI_1' })
  jumlahLusi1?: number;

  @Field({ nullable: true })
  @Column({ name: 'DENIER_1' })
  denier1?: string;

  @Field({ nullable: true })
  @Column({ name: 'AFAL_AKTUAL_1' })
  afalAktual1?: number;

  @Field({ nullable: true })
  @Column({ name: 'JENIS_BENANG_2' })
  jenisBenang2?: string;

  @Field({ nullable: true })
  @Column({ name: 'LOT_BATCH_NO' })
  lotBatchNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'JUMLAH_HELAI_LUSI_2' })
  jumlahHelaiLusi2?: string;

  @Field({ nullable: true })
  @Column({ name: 'PANJANG_LUSI_2' })
  panjangLusi2?: number;

  @Field({ nullable: true })
  @Column({ name: 'QTY_KG_2' })
  qtyKg2?: number;

  @Field({ nullable: true })
  @Column({ name: 'TARGET_BAN_2' })
  targetBan2?: number;

  @Field({ nullable: true })
  @Column({ name: 'JUMLAH_BAN_2' })
  jumlahBan2?: number;

  @Field({ nullable: true })
  @Column({ name: 'NO_MC_TENUN_2' })
  noMcTenun2?: string;

  @Field({ nullable: true })
  @Column({ name: 'SO_BEAM_4' })
  soBeam4?: string;

  @Field({ nullable: true })
  @Column({ name: 'SO_TENUN_4' })
  soTenun4?: string;

  @Field({ nullable: true })
  @Column({ name: 'CORAK_KAIN_4' })
  corakKain4?: string;

  @Field({ nullable: true })
  @Column({ name: 'WARNA_LUSI_4' })
  warnaLusi4?: string;

  @Field({ nullable: true })
  @Column({ name: 'BENANG_PER_BOBIN_4' })
  benangPerBobin4?: string;

  @Field({ nullable: true })
  @Column({ name: 'MC_BENANG_4' })
  mcBenang4?: string;

  @Field({ nullable: true })
  @Column({ name: 'METER_BEAM_4' })
  meterBeam4?: number;

  @Field({ nullable: true })
  @Column({ name: 'JML_PASANG_4' })
  jmlPasang4?: number;

  @Field({ nullable: true })
  @Column({ name: 'LEBAR_BEAM_4' })
  lebarBeam4?: number;

  @Field({ nullable: true })
  @Column({ name: 'LEBAR_BAN_4' })
  lebarBan4?: number;

  @Field({ nullable: true })
  @Column({ name: 'FEED_MESIN_4' })
  feedMesin4?: number;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field({ nullable: true })
  @Column({ name: 'CREATED_BY' })
  createdBy?: string;

  @Field({ nullable: true })
  @Column({ name: 'CREATED_AT' })
  createdAt?: Date;
}
