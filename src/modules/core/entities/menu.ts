import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_APP_MENU')
@ObjectType()
export class Menu extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'ROOT' })
  root!: string;
  
  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field()
  @Column({ name: 'TYPE' })
  type!: string;

  @Field({ nullable: true })
  @Column({ name: 'TO_LINK' })
  to?: string;

  @Field({ nullable: true })
  @Column({ name: 'ICON' })
  icon?: string;

  @Field({ nullable: true })
  @Column({ name: 'PARENT' })
  parent?: number;

  @Field({ nullable: true })
  @Column({ name: 'PARENT_NAME' })
  parentName?: string;

  @Field({ nullable: true })
  @Column({ name: 'MENU_ALIAS' })
  menuAlias?: string;
}
