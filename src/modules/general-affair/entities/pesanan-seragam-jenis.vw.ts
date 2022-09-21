import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_JENIS_SERAGAM_V')
@ObjectType()
export class JenisSeragamView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'JENIS' })
  jenis!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
