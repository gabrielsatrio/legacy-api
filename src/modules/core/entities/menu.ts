import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_MENU_EZIO')
@ObjectType()
export class Menu extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: string;

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
  parent?: string;
}
