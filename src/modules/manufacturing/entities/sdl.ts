import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_SDL')
@ObjectType()
export class Sdl extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'SDL_ID' })
  sdlId!: number;

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
  @Column({ name: 'FILE_NAME' })
  fileName!: string;

  @Field()
  @Column({ name: 'TIER' })
  tier!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;
}
