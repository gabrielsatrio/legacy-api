import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_EXPEDITION_TAB')
@ObjectType()
export class Expedition extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EXPEDITION_ID' })
  expeditionId!: string;

  @Field()
  @Column({ name: 'EXPEDITION_NAME' })
  expeditionName!: string;
}
