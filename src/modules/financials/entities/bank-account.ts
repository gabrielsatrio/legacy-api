import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_BANK_ACCOUNT')
@ObjectType()
export class BankAccount extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ACCOUNT_NO' })
  accountNo!: string;

  @Field()
  @Column({ name: 'ACCOUNT_DESCRIPTION' })
  accountDescription!: string;
}
