import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('INVENTORY_PART')
@ObjectType()
export class InventoryPart extends BaseEntity {
  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_STATUS' })
  partStatus!: string;

  @Field()
  @PrimaryColumn({ name: 'OBJID' })
  objId!: string;
}
