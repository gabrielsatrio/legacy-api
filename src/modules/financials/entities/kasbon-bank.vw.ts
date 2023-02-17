import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_BANK_KASBON_V')
@ObjectType()
export class BankKasbonView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'BANK' })
  bank!: string;
}
