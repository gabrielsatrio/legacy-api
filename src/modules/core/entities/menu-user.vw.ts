import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_APP_USER_ROLE_V')
@ObjectType()
export class MenuUserView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'MENU_ID' })
  menuId!: number;

  @Field()
  @PrimaryColumn({ name: 'USERNAME' })
  username!: string;

  @Field()
  @Column({ name: 'MENU_NAME' })
  menuName!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;
}
