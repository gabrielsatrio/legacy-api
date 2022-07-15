import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { mapError } from '../../utils/map-error';
import { MenuUser } from './entities/menu-user';
import { MenuUserInput } from './menu-user.in';

@Resolver(MenuUser)
export class MenuUserResolver {
  @Query(() => [MenuUser])
  @UseMiddleware(isAuth)
  async getAllMenuUser(): Promise<MenuUser[]> {
    return await MenuUser.find({ order: { username: 'ASC' } });
  }

  @Mutation(() => MenuUser)
  @UseMiddleware(isAuth)
  async createMenuUser(
    @Arg('input') input: MenuUserInput
  ): Promise<MenuUser | null> {
    try {
      const sql = `
    BEGIN
    atj_app_menu_api.add_user_menu(
      :username,
      :menuName,
      :menuId);
    END;
  `;

      await ifs.query(sql, [input.username, input.menuName, input.menuId]);

      const data = await MenuUser.findOneBy({
        username: input.username,
        menuId: input.menuId
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MenuUser)
  @UseMiddleware(isAuth)
  async deleteMenuUser(
    @Arg('menuId') menuId: number,
    @Arg('username') username: string
  ): Promise<MenuUser> {
    try {
      const tt = await MenuUser.findOneBy({
        menuId: menuId,
        username: username
      });

      if (!tt) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      atj_app_menu_api.delete_user_menu(
        :username,:menuId);
      END;
    `;

      await ifs.query(sql, [username, menuId]);

      return tt;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
