import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { SoObatProses } from './mdp-so-obat-proses';

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

  @Field({ nullable: true })
  @Column({ name: 'SCRAP_FACTOR' })
  scrapFactor?: number;

  @Field({ nullable: true })
  @Column({ name: 'SCRAP_COMPONENT' })
  scrapComponent?: number;

  @Field({ nullable: true })
  @Column({ name: 'QTY_ASM' })
  qtyAsm?: number;

  @Field({ nullable: true })
  @Column({ name: 'BERAT' })
  berat?: number;

  @Field()
  @Column({ name: 'QTY_REQUIRED' })
  qtyRequired!: number;

  @Field({ nullable: true })
  @Column({ name: 'STATUS_MATERIAL' })
  statusMaterial?: string;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;

  @ManyToOne(() => SoObatProses, (SoObatProses) => SoObatProses.details)
  @JoinColumn({ name: 'ORDER_NO', referencedColumnName: 'orderNo' })
  master!: SoObatProses;
}
