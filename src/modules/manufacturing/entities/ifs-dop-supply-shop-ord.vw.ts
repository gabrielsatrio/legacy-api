import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('DOP_SUPPLY_SHOP_ORD')
@ObjectType()
export class IfsDopSupplyShopOrdView extends BaseEntity {
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
  @PrimaryColumn({ name: 'DOP_ID' })
  dopId!: string;

  @Field()
  @PrimaryColumn({ name: 'DOP_ORDER_ID' })
  dopOrderId!: string;

  @Field()
  @Column({ name: 'REVISED_QTY_DUE' })
  revisedQtyDue!: number;

  @Field()
  @Column({ name: 'ORIGINAL_QTY_DUE' })
  originalQtyDue!: number;

  @Field()
  @Column({ name: 'QTY_PEGGED' })
  qtyPegged!: number;

  @Field()
  @Column({ name: 'DUE_DATE' })
  dueDate!: Date;

  @Field()
  @Column({ name: 'ORIGINAL_DUE_DATE' })
  originalDueDate!: Date;
}
