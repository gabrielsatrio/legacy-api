import { Field, InputType } from 'type-graphql';
import { MenuRole } from './entities/menu-role';

@InputType()
export class MenuRoleInput implements Partial<MenuRole> {
  @Field()
  menuId!: number;

  @Field()
  dept!: string;

  @Field()
  menuName!: string;
}
