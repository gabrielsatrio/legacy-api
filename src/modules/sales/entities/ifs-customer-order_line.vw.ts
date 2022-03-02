import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CUSTOMER_ORDER_LINE')
@ObjectType()
export class IfsCustomerOrderLineView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: string;

  @Field()
  @PrimaryColumn({ name: 'REL_NO' })
  relNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_ITEM_NO' })
  lineItemNo!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'CATALOG_NO' })
  catalogNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_NO' })
  partNo?: string;

  @Field()
  @Column({ name: 'BUY_QTY_DUE' })
  buyQtyDue!: number;

  @Field({ nullable: true })
  @Column({ name: 'CATALOG_DESC' })
  catalogDesc?: string;

  @Field()
  @Column({ name: 'QTY_ASSIGNED' })
  qtyAssigned!: number;

  @Field()
  @Column({ name: 'QTY_INVOICED' })
  qtyInvoiced!: number;

  @Field()
  @Column({ name: 'QTY_PICKED' })
  qtyPicked!: number;

  @Field()
  @Column({ name: 'QTY_RETURNED' })
  qtyReturned!: number;

  @Field()
  @Column({ name: 'QTY_SHIPPED' })
  qtyShipped!: number;

  @Field()
  @Column({ name: 'QTY_TO_SHIP' })
  qtyToShip!: number;

  @Field()
  @Column({ name: 'DESIRED_QTY' })
  desiredQty!: number;
}
