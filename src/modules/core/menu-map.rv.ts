import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { MenuMap } from './entities/menu-map';

@Resolver(MenuMap)
export class MenuMapResolver {
  @Query(() => [MenuMap], { nullable: true })
  @UseMiddleware(isAuth)
  async getMenuMap(): Promise<MenuMap[] | null> {
    try {
      const sql = `SELECT DISTINCT department AS "department" FROM atj_app_menu_map`;
      return await ifs.query(sql);
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
