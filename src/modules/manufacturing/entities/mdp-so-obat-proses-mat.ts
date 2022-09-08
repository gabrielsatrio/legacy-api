import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { SoObatProses } from './mdp-so-obat-proses';
import { SoObatReserve } from './mdp-so-obat-reserve';

@Entity('CHR_SO_OBAT_PROSES_MATERIAL')
@ObjectType()
export class SoObatProsesMaterial extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field(() => Int)
  @PrimaryColumn({ name: 'LINE_ITEM_NO' })
  lineItemNo!: number;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'STRUCTURE_LINE_NO' })
  structureLineNo?: number;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'PART_DESCRIPTION' })
  partDescription!: string;

  @Field({ nullable: true })
  @Column({ name: 'SCRAP_FACTOR' })
  scrapFactor?: number;

  @Field({ nullable: true })
  @Column({ name: 'SCRAP_COMPONENT' })
  scrapComponent?: number;

  @Field({ nullable: true })
  @Column({ name: 'QTY_ASM' })
  qtyPerAssembly?: number;

  @Field({ nullable: true })
  @Column({ name: 'BERAT' })
  berat?: number;

  @Field({ nullable: true })
  @Column({ name: 'BERAT_AWAL' })
  beratAwal?: number;

  @Field({ nullable: true })
  @Column({ name: 'BERAT_NET' })
  beratNet?: number;

  @Field()
  @Column({ name: 'QTY_REQUIRED' })
  qtyRequired!: number;

  @Field({ nullable: true })
  @Column({ name: 'STATUS_MATERIAL' })
  statusMaterial?: string;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;

  @Field({ nullable: true })
  @Column({ name: 'QTY_LAST_BATCH' })
  qtyLastBatch?: number;

  @Field({ nullable: true })
  @Column({ name: 'QTY_LAST_ASM' })
  qtyLastAsm?: number;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @ManyToOne(() => SoObatProses, (SoObatProses) => SoObatProses.details)
  @JoinColumn({ name: 'ORDER_NO', referencedColumnName: 'orderNo' })
  master!: SoObatProses;

  @Field(() => [SoObatReserve], { nullable: true })
  @OneToMany(() => SoObatReserve, (SoObatReserve) => SoObatReserve.masterLine, {
    nullable: true
  })
  detailReserve?: SoObatReserve[];
}
