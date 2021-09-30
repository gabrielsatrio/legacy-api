import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CUSTOMER_INFO')
@ObjectType()
export class CustomerInfo extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CUSTOMER_ID' })
  customerId!: string;

  @Field()
  @Column({ name: 'NAME' })
  customerName!: string;
}
