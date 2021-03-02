import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('USER')
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'ID' })
  readonly id!: number;

  @Field()
  @Column({ name: 'USERNAME', unique: true })
  username!: string;

  @Field()
  @Column({ name: 'FIRST_NAME' })
  firstName!: string;

  @Field()
  @Column({ name: 'LAST_NAME', nullable: true })
  lastName!: string;

  @Column({ name: 'PASSWORD' })
  password!: string;

  @Field()
  @Column({ name: 'EMAIL', unique: true })
  email!: string;

  @Field()
  @Column({ name: 'ROLE' })
  role!: string;

  @Field()
  @Column({ name: 'CONFIRMED', default: false })
  confirmed!: boolean;

  @Field()
  @Index()
  @Column({ name: 'IS_ACTIVE', default: true })
  isActive!: boolean;

  @Field()
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
