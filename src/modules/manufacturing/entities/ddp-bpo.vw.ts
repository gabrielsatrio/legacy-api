import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { BPOAuxiliaries } from './ddp-bpo-auxiliaries';
import { BPODyestuff } from './ddp-bpo-dyestuff';

@Entity('CHR_DDP_BPO_V')
@ObjectType()
export class DdpBpoView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID_NO' })
  idNo!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'JENIS_KU' })
  jenisKu!: string;

  @Field()
  @PrimaryColumn({ name: 'MATERIAL_LENGTH' })
  materialLength!: string;

  @Field({ nullable: true })
  @CreateDateColumn({ name: 'TANGGAL' })
  tanggal?: Date;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'ORDER_NO' })
  orderNo?: string;

  @Field()
  @Column({ name: 'NO_MESIN' })
  noMesin!: string;

  @Field()
  @Column({ name: 'LOT_CELUP' })
  lotCelup!: string;

  @Field({ nullable: true })
  @Column({ name: 'LIQUID_RATIO' })
  liquidRatio?: number;

  @Field({ nullable: true })
  @Column({ name: 'VOLUME' })
  volume?: number;

  @Field({ nullable: true })
  @Column({ name: 'WEIGHT' })
  weight?: number;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'ALT_RECEIPE' })
  altReceipe?: number;

  @Field({ nullable: true })
  @Column({ name: 'PROGRAM_NO' })
  programNo?: string;

  @Field()
  @PrimaryColumn({ name: 'KU_COUNT' })
  kuCount!: number;

  @Field({ nullable: true })
  @Column({ name: 'SENT_TO_AUX' })
  sentToAux?: number;

  @Field({ nullable: true })
  @Column({ name: 'LOT_SIZE' })
  lotSize?: number;

  @Field({ nullable: true })
  @Column({ name: 'PRINT_AUX' })
  printAux?: number;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field({ nullable: true })
  @Column({ name: 'DEFECT_ID' })
  defectId?: string;

  @Field({ nullable: true })
  @Column({ name: 'PROCESS_NOTE' })
  processNote?: string;

  @Field(() => [BPODyestuff], { nullable: true })
  @OneToMany(() => BPODyestuff, (BPODyestuff) => BPODyestuff.dyestuffs, {
    nullable: true
  })
  dyestuffsUses?: BPODyestuff[];

  @Field(() => [BPOAuxiliaries], { nullable: true })
  @OneToMany(
    () => BPOAuxiliaries,
    (BPOAuxiliaries) => BPOAuxiliaries.auxiliaries,
    { nullable: true }
  )
  auxiliariesUses?: BPOAuxiliaries[];
}
