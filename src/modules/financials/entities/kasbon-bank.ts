import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_BANK_KASBON')
@ObjectType()
export class BankKasbon extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'BANK' })
  bank!: string;
}
