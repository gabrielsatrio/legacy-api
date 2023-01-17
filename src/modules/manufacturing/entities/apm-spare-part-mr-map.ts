import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_MR_SPAREPART_MAP')
@ObjectType()
export class SparePartMrMap extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: string;

  @Field()
  @PrimaryColumn({ name: 'RELEASE_NO' })
  releaseNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_ITEM_NO' })
  lineItemNo!: number;

  @Field()
  @PrimaryColumn({ name: 'ORDER_CLASS' })
  orderClass!: string;

  @Field()
  @PrimaryColumn({ name: 'MACHINE_ID' })
  machineId!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'QUANTITY' })
  quantity?: number;

  @Field({ defaultValue: false })
  @Column({ name: 'NON_KS' })
  nonKS!: boolean;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
