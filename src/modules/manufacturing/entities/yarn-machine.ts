import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_YARN_MACHINE')
@ObjectType()
export class YarnMachine extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'MACHINE' })
  machine!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;
}
