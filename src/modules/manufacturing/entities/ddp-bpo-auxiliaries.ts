import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { DDPBPO } from './ddp-bpo';

@Entity('CHR_DDT_AUXILIARIES')
@ObjectType()
export class BPOAuxiliaries extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ID_NO' })
  idNo!: string;

  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'PART_DESC' })
  partDesc!: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_ACTUAL' })
  partActual?: string;

  @Field()
  @Column({ name: 'PERSENTASE' })
  persentase!: number;

  @Field()
  @Column({ name: 'TOTAL' })
  total!: number;

  @Field({ nullable: true })
  @Column({ name: 'LOT_BATCH_NO' })
  lotBatchNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'ORDER_NO' })
  orderNo?: string;

  @Field(() => Int)
  @PrimaryColumn({ name: 'KU_COUNT' })
  kuCount!: number;

  @Field({ nullable: true })
  @Column({ name: 'BERAT_AKTUAL' })
  beratAktual?: number;

  @Field({ nullable: true })
  @Column({ name: 'ID_TABLE' })
  objId?: string;

  @Field({ nullable: true })
  @Column({ name: 'QTY_LOT' })
  qtyLot?: number;

  @Field({ nullable: true })
  @Column({ name: 'LOT_BATCH_NO2' })
  lotBatchNo2?: string;

  @Field({ nullable: true })
  @Column({ name: 'QTY_LOT2' })
  qtyLot2?: number;

  @Field({ nullable: true })
  @Column({ name: 'STATUS_RESERVE' })
  statusReserve?: string;

  @Field({ nullable: true })
  @Column({ name: 'NO' })
  no?: number;

  @ManyToOne(() => DDPBPO, (dDPBPO) => dDPBPO.auxiliariesUses)
  @JoinColumn({ name: 'CONTRACT', referencedColumnName: 'contract' })
  @JoinColumn({ name: 'ID_NO', referencedColumnName: 'idNo' })
  @JoinColumn({ name: 'KU_COUNT', referencedColumnName: 'kuCount' })
  auxiliaries!: DDPBPO;
}
