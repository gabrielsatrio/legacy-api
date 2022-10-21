import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PURCHASE_PART')
@ObjectType()
export class IfsPurchasePartView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'DEFAULT_BUY_UNIT_MEAS' })
  defaultBuyUnitMeas!: string;
}
