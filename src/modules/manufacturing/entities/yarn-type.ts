import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_YARN_TYPE')
@ObjectType()
export class YarnType extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'YARN_TYPE' })
  yarnType!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;
}
