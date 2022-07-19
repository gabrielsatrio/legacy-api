import { Field, InputType } from 'type-graphql';
import { MenuUser } from './entities/menu-user';

@InputType()
export class MenuUserInput implements Partial<MenuUser> {
  @Field()
  menuId!: number;

  @Field()
  username!: string;

  @Field()
  menuName!: string;
}
