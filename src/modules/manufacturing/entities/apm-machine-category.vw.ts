import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('ROB_APM_MACHINE_CATEGORY_V')
@ObjectType()
export class MachineCategoryView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CATEGORY_ID' })
  categoryId!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;
}
