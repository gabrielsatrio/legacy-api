import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('IFSAPP.SITE_TAB')
@ObjectType()
export class SiteTab extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;
}
