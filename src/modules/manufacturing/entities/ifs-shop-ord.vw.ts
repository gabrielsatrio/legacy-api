import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SHOP_ORD')
@ObjectType()
export class IfsShopOrderView extends BaseEntity {
  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'ORG_QTY_DUE' })
  orgQtyDue!: number;

  @Field()
  @Column({ name: 'QTY_COMPLETE' })
  qtyComplete!: number;

  @Field({ nullable: true })
  @Column({ name: 'JOB_ORDER' })
  jobOrder?: string;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;
}
