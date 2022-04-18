import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_WARPING_MACHINE')
@ObjectType()
export class WarpingMachine extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'NAME' })
  name?: string;

  @Field({ nullable: true })
  @Column({ name: 'CONTRACT' })
  contract?: string;
}
