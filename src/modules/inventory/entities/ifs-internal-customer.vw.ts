import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('INTERNAL_CUSTOMER')
@ObjectType()
export class IfsInternalCustomerView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'INT_CUSTOMER_NO' })
  intCustomerNo!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;
}
