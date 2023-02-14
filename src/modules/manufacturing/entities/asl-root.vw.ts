import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_ASL_ROOT_V')
@ObjectType()
export class AslRootView extends BaseEntity {
  @Field({ nullable: true })
  @PrimaryColumn({ name: 'MENU_ID' })
  menuId?: string;

  @Field({ nullable: true })
  @Column({ name: 'PLATFORM' })
  platform?: string;

  @Field({ nullable: true })
  @Column({ name: 'CATEGORY' })
  category?: string;

  @Field({ nullable: true })
  @Column({ name: 'NAME' })
  name?: string;

  @Field({ nullable: true })
  @Column({ name: 'FILENAME' })
  filename?: string;
}
