import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MenuRole } from './entities/menu-role';
import { MenuRoleInput } from './menu-role.in';

@Resolver(MenuRole)
export class MenuRoleResolver {
  @Query(() => [MenuRole])
  @UseMiddleware(isAuth)
  async getAllMenuRole(): Promise<MenuRole[]> {
    try {
      const result = await MenuRole.find({ order: { menuId: 'ASC' } });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MenuRole)
  @UseMiddleware(isAuth)
  async createMenuRole(
    @Arg('input') input: MenuRoleInput
  ): Promise<MenuRole | null> {
    try {
      const sql = `
        BEGIN
          ATJ_App_Menu_API.Add_Department_Menu(:dept, :menuName, :menuId);
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      await ifs.query(sql, [input.dept, input.menuName, input.menuId]);
      const result = await MenuRole.findOneBy({
        menuId: input.menuId,
        dept: input.dept
      });
      return result;
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
      const data = await MenuRole.findOneBy({ menuId: menuId, dept: dept });
      if (!data) throw new Error('No data found.');
      const sql = `
        BEGIN
          ATJ_App_Menu_API.Delete_Department_Menu(:dept,:menuId);
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      await ifs.query(sql, [dept, menuId]);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
