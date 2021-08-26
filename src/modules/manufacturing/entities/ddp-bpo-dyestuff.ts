import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { DDPBPO } from './ddp-bpo';

@Entity('CHR_DDT_DYESTUFF_TAB')
@ObjectType()
export class BPODyestuff extends BaseEntity {
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

  @Field()
  @Column({ name: 'KODE_KUANS' })
  kodeKuans?: string;

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

  @Field()
  @PrimaryColumn({ name: 'KU_COUNT' })
  kuCount!: number;

  @Field({ nullable: true })
  @Column({ name: 'ID_TABLE' })
  idTable?: string;

  @ManyToOne(() => DDPBPO, (dDPBPO) => dDPBPO.dyestuffsUses)
  @JoinColumn({ name: 'CONTRACT', referencedColumnName: 'contract' })
  @JoinColumn({ name: 'ID_NO', referencedColumnName: 'idNo' })
  @JoinColumn({ name: 'KU_COUNT', referencedColumnName: 'kuCount' })
  dyestuffs!: DDPBPO;
}
