import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_APP_MENU_MAP')
@ObjectType()
export class MenuMap extends BaseEntity {
  @Field({ nullable: true })
  @PrimaryColumn({ name: 'DEPARTMENT' })
  department!: string;
}
