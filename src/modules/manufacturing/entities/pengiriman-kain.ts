import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_PENGIRIMAN_KAIN')
@ObjectType()
export class PengirimanKain extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'TGL' })
  tgl!: Date;

  @Field()
  @Column({ name: 'SHIFT' })
  shift!: string;

  @Field()
  @Column({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @Column({ name: 'CATEGORY' })
  category!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'JOB_ORDER' })
  jobOrder!: string;

  @Field()
  @Column({ name: 'QTY_KP' })
  qtyKp!: number;

  @Field()
  @Column({ name: 'QTY_REAL' })
  qtyReal!: number;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
