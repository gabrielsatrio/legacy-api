import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('WAREHOUSE_BAY_BIN')
@ObjectType()
export class IfsInvLocationView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'OBJID' })
  objId!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'WAREHOUSE_ID' })
  warehouseId!: string;

  @Field()
  @Column({ name: 'LOCATION_NO' })
  locationNo!: string;
}
