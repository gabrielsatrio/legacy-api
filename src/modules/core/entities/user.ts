import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('USER')
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'USERNAME', unique: true })
  username!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Column({ name: 'PASSWORD' })
  password!: string;

  @Field()
  @Column({ name: 'EMAIL', unique: true })
  email!: string;

  @Field()
  @Index()
  @Column({ name: 'STATUS', default: 'Active' })
  status!: 'Active' | 'Inactive';

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;
}
