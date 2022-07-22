import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_APP_USER_ROLE')
@ObjectType()
export class MenuUser extends BaseEntity {
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
  @Column({ name: 'OBJ_ID' })
  objId!: string;
}
