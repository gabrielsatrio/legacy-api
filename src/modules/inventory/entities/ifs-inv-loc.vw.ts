import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('INVENTORY_LOCATION')
@ObjectType()
export class InventoryLocation extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field()
  @Column({ name: 'LOCATION_GROUP' })
  locationGroup!: string;

  @Field()
  @Column({ name: 'WAREHOUSE' })
  warehouse!: string;

  @Field()
  @Column({ name: 'BAY_NO' })
  bayNo!: string;

  @Field()
  @Column({ name: 'ROW_NO' })
  rowNo!: string;

  @Field()
  @Column({ name: 'TIER_NO' })
  tierNo!: string;

  @Field()
  @Column({ name: 'BIN_NO' })
  binNo!: string;

  @Field()
  @Column({ name: 'LOCATION_NAME' })
  locationName!: string;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;
}
