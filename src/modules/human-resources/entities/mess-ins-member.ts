import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('VKY_INS_PENGHUNI_MESS')
export class InsMessMember extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'NRP' })
  nrp!: string;
  @Field()
  @Column({ name: 'MESS' })
  mess!: string;
  @Field()
  @Column({ name: 'INSERT_BY' })
  insert_by!: string;
}
