import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { SoObatProsesMaterial } from './mdp-so-obat-proses-mat';

@Entity('CHR_SO_OBAT_RESERVE')
@ObjectType()
export class SoObatReserve extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOT_BOOKING' })
  lotBooking!: string;

  @Field()
  @Column({ name: 'LOT_QTY' })
  lotQty!: number;

  @Field()
  @Column({ name: 'QTY_RESERVE' })
  qtyReserve!: number;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;

  @ManyToOne(
    () => SoObatProsesMaterial,
    (SoObatProsesMaterial) => SoObatProsesMaterial.detailReserve
  )
  @JoinColumn({ name: 'ORDER_NO', referencedColumnName: 'orderNo' })
  masterLine!: SoObatProsesMaterial;
}
