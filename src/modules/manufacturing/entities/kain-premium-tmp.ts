import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_KAIN_PREMIUM_TMP')
@ObjectType()
export class KainPremiumTmp extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @Column({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field()
  @Column({ name: 'GROSS_LENGTH' })
  grossLength!: number;

  @Field()
  @Column({ name: 'QUANTITY' })
  quantity!: number;

  @Field({ nullable: true })
  @Column({ name: 'PIECE_NO' })
  pieceNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'JOB_ORDER' })
  jobOrder?: string;

  @Field({ nullable: true })
  @Column({ name: 'LOT_BATCH_SOURCE' })
  lotBatchSource?: string;

  @Field({ nullable: true })
  @Column({ name: 'CUT_QTY' })
  cutQty?: number;

  @Field({ nullable: true })
  @Column({ name: 'DEFECT_QTY' })
  defectQty?: number;

  @Field({ nullable: true })
  @Column({ name: 'JENIS_KAIN' })
  jenisKain?: string;
}
