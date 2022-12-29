import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_PURCHASE_ORDER_LOG_V')
@ObjectType()
export class PurchaseOrderLogView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'MODIFIED_AT' })
  modifiedAt!: Date;

  @Field()
  @Column({ name: 'MODIFIED_BY' })
  modifiedBy!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'PO_NUMBER' })
  poNumber!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;
}
