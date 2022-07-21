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
  @Column({ name: 'DEPARTMENT' })
  department!: string;

  @Field()
  @Column({ name: 'MESS' })
  mess!: string;

  @Field()
  @Column({ name: 'VALID_FROM' })
  validFrom!: Date;

  @Field()
  @Column({ name: 'VALID_TO' })
  validTo!: Date;

  @Field()
  @Column({ name: 'IS_KETUA' })
  isKetua!: number;

  @Field()
  @Column({ name: 'INSERT_BY' })
  insertBy!: string;
}
