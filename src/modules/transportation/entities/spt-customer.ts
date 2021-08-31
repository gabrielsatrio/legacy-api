import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_CUSTOMER_TAB')
@ObjectType()
export class Customer extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CUSTOMER_ID' })
  customerId!: string;

  @Field()
  @Column({ name: 'CUSTOMER_NAME' })
  customerName!: string;

  @Field()
  @Column({ name: 'ADDRESS' })
  address?: string;

  @Field({ nullable: true })
  @Column({ name: 'PHONE' })
  phone?: string;
}
