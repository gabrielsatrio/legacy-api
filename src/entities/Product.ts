import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('PRODUCT')
@ObjectType()
export class Product extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'ID' })
  readonly id!: number;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field()
  @Column({ name: 'CATEGORY' })
  category!: string;

  @Field()
  @Column({ name: 'PRICE' })
  price!: number;

  @Field()
  @Column({ name: 'QUANTITY' })
  quantity!: number;

  @Field({ nullable: true })
  @Column({ name: 'IMAGE' })
  image!: string;

  @Field()
  @Column({ name: 'IS_ACTIVE' })
  isActive!: boolean;

  @Field()
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
