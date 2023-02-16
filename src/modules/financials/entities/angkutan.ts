import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_ANGKUTAN')
@ObjectType()
export class Angkutan extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'ANGKUTAN' })
  angkutan!: string;

  @Field()
  @Column({ name: 'START_DATE' })
  startDate!: Date;

  @Field()
  @Column({ name: 'END_DATE' })
  endDate!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'USERNAME_IFS' })
  usernameIfs!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;
}
