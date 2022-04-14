import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SHOP_MATERIAL_ALLOC')
@ObjectType()
export class IfsShopMaterialAllocView extends BaseEntity {
  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'RELEASE_NO' })
  releaseNo!: string;

  @Field()
  @PrimaryColumn({ name: 'SEQUENCE_NO' })
  sequenceNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_ITEM_NO' })
  lineItemNo!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'QTY_PER_ASSEMBLY' })
  qtyPerAssembly!: number;
}
