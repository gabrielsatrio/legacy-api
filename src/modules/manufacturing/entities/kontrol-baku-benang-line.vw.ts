import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_KONTROL_BAKU_BENANG_LINE_V')
@ObjectType()
export class KontrolBakuBenangLineView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID_KONTROL' })
  idKontrol!: number;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_NO' })
  partNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_DESC' })
  partDesc?: string;

  @Field({ nullable: true })
  @Column({ name: 'LOT_BATCH_NO' })
  lotBatchNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'RECEIPT_QTY' })
  receiptQty?: number;

  @Field({ nullable: true })
  @Column({ name: 'MACHINE' })
  machine?: string;

  @Field({ nullable: true })
  @Column({ name: 'START_DATE' })
  startDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'REMAINING_QTY' })
  remainingQty?: number;

  @Field({ nullable: true })
  @Column({ name: 'CREATED_BY' })
  createdBy?: string;

  @Field({ nullable: true })
  @Column({ name: 'CREATED_AT' })
  createdAt?: Date;

  @Field({ nullable: true })
  @Column({ name: 'UPDATED_AT' })
  updatedAt?: Date;
}
