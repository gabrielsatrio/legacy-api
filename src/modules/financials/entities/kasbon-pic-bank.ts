import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_PIC_BANK')
@ObjectType()
export class PicBank extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'USERNAME' })
  username!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;
}
