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
      const sqlDept = `select distinct department as "department" from ATJ_APP_MENU_MAP`;
      const dept = await ifs.query(sqlDept);

      return dept;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
