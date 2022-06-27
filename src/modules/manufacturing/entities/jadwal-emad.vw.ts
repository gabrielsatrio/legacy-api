import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_JADWAL_EMAD_V')
@ObjectType()
export class JadwalEmadView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @Column({ name: 'SPINDLE' })
  spindle!: number;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field()
  @Column({ name: 'DOP_ID' })
  dopId!: string;

  @Field()
  @Column({ name: 'QTY' })
  qty!: number;

  @Field()
  @Column({ name: 'EST_DATE' })
  estDate!: Date;

  @Field()
  @Column({ name: 'LOT_SIZE' })
  lotSize!: number;

  @Field()
  @Column({ name: 'QTY_COMPLETE' })
  qtyComplete!: number;

  @Field()
  @Column({ name: 'QTY_REMAINING' })
  qtyRemaining!: number;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
