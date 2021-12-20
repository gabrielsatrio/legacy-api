import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_WINDING_QC')
@ObjectType()
export class WindingQC extends BaseEntity {
  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'ROLL_NO' })
  rollNo!: number;

  @Field()
  @Column({ name: 'DESIGN' })
  design!: string;

  @Field()
  @Column({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @Column({ name: 'PIECE_NO' })
  pieceNo!: string;

  @Field()
  @Column({ name: 'GROSS' })
  gross!: number;

  @Field()
  @Column({ name: 'NETTO' })
  netto!: number;

  @Field({ nullable: true })
  @Column({ name: 'LABEL_FISIK_KAIN' })
  labelFisikKain?: string;

  @Field({ nullable: true })
  @Column({ name: 'GARIS' })
  garis?: string;

  @Field({ nullable: true })
  @Column({ name: 'GELOMBANG_TENGAH' })
  gelombangTengah?: string;

  @Field({ nullable: true })
  @Column({ name: 'GELOMBANG_PINGGIR' })
  gelombangPinggir?: string;

  @Field({ nullable: true })
  @Column({ name: 'KERUTAN' })
  kerutan?: string;

  @Field({ nullable: true })
  @Column({ name: 'KUSUT_ROLLAN' })
  kusutRollan?: string;

  @Field({ nullable: true })
  @Column({ name: 'KETERANGAN' })
  keterangan?: string;

  @Field({ nullable: true })
  @Column({ name: 'OPERATOR' })
  operator?: string;

  @Field({ nullable: true })
  @Column({ name: 'MESIN' })
  mesin?: string;

  @Field({ nullable: true })
  @Column({ name: 'TANGGAL' })
  tanggal?: Date;

  @Field({ nullable: true })
  @Column({ name: 'SHIFT' })
  shift?: string;

  @Field()
  @PrimaryColumn({ name: 'ID_NO' })
  idNo!: number;
}
