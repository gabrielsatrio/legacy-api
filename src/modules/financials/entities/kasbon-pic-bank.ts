import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_PIC_BANK')
@ObjectType()
export class PicBank extends BaseEntity {
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
