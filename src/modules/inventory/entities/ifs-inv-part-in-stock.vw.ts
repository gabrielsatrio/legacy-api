import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('INVENTORY_PART_IN_STOCK')
@ObjectType()
export class InventoryPartInStock extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field()
  @Column({ name: 'QTY_ONHAND' })
  qtyOnhand!: number;

  @Field()
  @Column({ name: 'QTY_RESERVED' })
  qtyReserved!: number;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;
}
