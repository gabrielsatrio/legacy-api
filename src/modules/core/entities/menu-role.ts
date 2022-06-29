import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_APP_ROLE')
@ObjectType()
export class MenuRole extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'MENU_ID' })
  menuId!: number;

  @Field()
  @PrimaryColumn({ name: 'DEPT' })
  dept!: string;

  @Field()
  @Column({ name: 'MENU_NAME' })
  menuName!: string;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;
}
