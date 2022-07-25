import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_PENGHUNI_MESS')
@ObjectType()
export class MessMember extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'NRP' })
  nrp!: string;

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
  isKetua!: boolean;

  @Field()
  @Column({ name: 'INSERT_BY' })
  insertBy!: string;
}
