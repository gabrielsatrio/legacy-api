import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_ASL')
@ObjectType()
export class Asl extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ASL_ID' })
  aslId!: number;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field()
  @Column({ name: 'CATEGORY' })
  category!: string;

  @Field()
  @Column({ name: 'PLATFORM' })
  platform!: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'FILENAME' })
  filename!: string;

  @Field()
  @Column({ name: 'TIER' })
  tier!: string;

  @Field()
  @Column({ name: 'PARENT_ID' })
  parentId!: number;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;
}
