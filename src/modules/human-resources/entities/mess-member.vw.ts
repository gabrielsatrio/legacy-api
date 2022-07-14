import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('VKY_PENGHUNI_MESS_V')
export class MessMemberView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;
  @Field()
  @Column({ name: 'NRP' })
  nrp!: string;
  @Field()
  @Column({ name: 'NAME' })
  name!: string;
  @Field()
  @Column({ name: 'MESS' })
  mess!: string;
  @Field()
  @Column({ name: 'DEPARTMENT' })
  department!: string;
  @Field()
  @Column({ name: 'IS_KETUA' })
  is_ketua!: number;
  @Field()
  @Column({ name: 'VALID_FROM' })
  valid_from!: Date;
  @Field()
  @Column({ name: 'VALID_TO' })
  valid_to!: Date;
  @Field()
  @Column({ name: 'INSERT_BY' })
  insert_by!: string;
}
