import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_IMS_WAREHOUSE_BAY_BIN_V')
@ObjectType()
export class ImsWarehouseBayBinView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'WAREHOUSE_ID' })
  warehouseId!: string;

  @Field()
  @PrimaryColumn({ name: 'BAY_ID' })
  bayId!: string;

  @Field()
  @PrimaryColumn({ name: 'ROW_ID' })
  rowId!: string;

  @Field()
  @PrimaryColumn({ name: 'TIER_ID' })
  tierId!: string;

  @Field()
  @PrimaryColumn({ name: 'BIN_ID' })
  binId!: string;

  @Field()
  @PrimaryColumn({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'DESCRIPTION' })
  description?: string;

  @Field()
  @Column({ name: 'CREATED_DATE' })
  createdDate!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'MODIFIED_DATE' })
  modifiedDate!: Date;

  @Field()
  @Column({ name: 'MODIFIED_BY' })
  modifiedBy!: string;
}
