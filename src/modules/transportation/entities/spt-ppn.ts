import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_PPN_TAB')
@ObjectType()
export class PPN extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EXPEDITION_ID' })
  expeditionId!: string;

  @Field()
  @Column({ name: 'PPN' })
  ppn!: string;
}
