import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_ASL_LOG')
@ObjectType()
export class AslLog extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ASL_ID' })
  aslId!: number;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;
}
