import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_SDL_SOURCE')
@ObjectType()
export class SdlSource extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'SDL_ID' })
  sdlId!: number;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'SOURCE_ID' })
  sourceId!: number;

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
