import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_KP_OEM_SEMENTARA_V')
@ObjectType()
export class KpOemSementaraView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'RESOURCE_ID' })
  resourceId?: string;

  @Field()
  @Column({ name: 'PICK_AWAL' })
  pickAwal!: number;

  @Field()
  @Column({ name: 'PICK_AKHIR' })
  pickAkhir!: number;

  @Field()
  @Column({ name: 'SELISIH' })
  selisih!: number;

  @Field()
  @Column({ name: 'QUANTITY' })
  quantity!: number;
}
