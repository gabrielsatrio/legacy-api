import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_EFF_BRAIDING')
@ObjectType()
export class EffBraiding extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'TGL' })
  tgl!: Date;
  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'QUANTITY' })
  quantity!: number;
}
