import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_PIC_BANK_V')
@ObjectType()
export class PicBankView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'USERNAME' })
  username!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;
}
