import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SITE_TAB')
@ObjectType()
export class SiteTab extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'DELIVERY_ADDRESS' })
  deliveryAddress?: string;

  @Field()
  @Column({ name: 'COMPANY' })
  company!: string;

  @Field()
  @Column({ name: 'DIST_CALENDAR_ID' })
  distCalendarId!: string;

  @Field()
  @Column({ name: 'MANUF_CALENDAR_ID' })
  manufCalendarId!: string;

  @Field()
  @Column({ name: 'OFFSET' })
  offset!: number;

  @Field({ nullable: true })
  @Column({ name: 'ROWVERSION' })
  rowversion?: Date;

  @Field({ nullable: true })
  @Column({ name: 'ROWKEY' })
  rowkey?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_CONTRACT_ALIAS' })
  ctmContractAlias?: string;
}
