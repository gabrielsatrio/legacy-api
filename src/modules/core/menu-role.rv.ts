import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { mapError } from '../../utils/map-error';
import { MenuRole } from './entities/menu-role';
import { MenuRoleInput } from './menu-role.in';

@Resolver(MenuRole)
export class MenuRoleResolver {
  @Query(() => [MenuRole])
  @UseMiddleware(isAuth)
  async getAllMenuRole(): Promise<MenuRole[]> {
    return await MenuRole.find();
  }

  @Mutation(() => MenuRole)
  @UseMiddleware(isAuth)
  async createMenuRole(
    @Arg('input') input: MenuRoleInput
  ): Promise<MenuRole | null> {
    try {
      const sql = `
    BEGIN
    atj_app_menu_api.add_department_menu(
      :dept,
      :menuName,
      :menuId);
    END;
  `;

      await ifs.query(sql, [input.dept, input.menuName, input.menuId]);

      const data = await MenuRole.findOneBy({
        menuId: input.menuId,
        dept: input.dept
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MenuRole)
  @UseMiddleware(isAuth)
  async deleteMenuRole(
    @Arg('menuId') menuId: number,
    @Arg('dept') dept: string
  ): Promise<MenuRole> {
    try {
      const tt = await MenuRole.findOneBy({
        menuId: menuId,
        dept: dept
      });

      if (!tt) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      atj_app_menu_api.delete_department_menu(
        :dept,:menuId);
      END;
    `;

      await ifs.query(sql, [dept, menuId]);

      return tt;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
