import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MenuUser } from './entities/menu-user';
import { MenuUserInput } from './menu-user.in';

@Resolver(MenuUser)
export class MenuUserResolver {
  @Query(() => [MenuUser])
  @UseMiddleware(isAuth)
  async getAllMenuUser(): Promise<MenuUser[]> {
    try {
      const result = await MenuUser.find({ order: { username: 'ASC' } });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MenuUser)
  @UseMiddleware(isAuth)
  async createMenuUser(
    @Arg('input') input: MenuUserInput
  ): Promise<MenuUser | null> {
    try {
      const sql = `
        BEGIN
          ATJ_App_Menu_API.Add_User_Menu(:username, :menuName, :menuId);
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      await ifs.query(sql, [input.username, input.menuName, input.menuId]);
      const result = await MenuUser.findOneBy({
        username: input.username,
        menuId: input.menuId
      });
      return result;
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
      const data = await MenuUser.findOneBy({
        menuId: menuId,
        username: username
      });
      if (!data) throw new Error('No data found.');
      const sql = `
        BEGIN
          ATJ_App_Menu_API.Delete_User_Menu(:username, :menuId);
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      await ifs.query(sql, [username, menuId]);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
