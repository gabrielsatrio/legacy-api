import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_DEFAULT_SERAGAM_V')
@ObjectType()
export class DefaultSeragamView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ROW' })
  row!: number;

  @Field()
  @Column({ name: 'TAHUN' })
  tahun!: string;

  @Field()
  @Column({ name: 'PERIODE' })
  periode!: number;

  @Field()
  @Column({ name: 'IS_LOCKED' })
  isLocked!: boolean;
}
