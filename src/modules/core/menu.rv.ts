import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { find, isArray } from 'lodash';
import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import FieldMenu from '../../types/field-menu';
import { mapError } from '../../utils/map-error';
import { Menu } from './entities/menu';
import { MenuInput } from './menu.in';

@Resolver(Menu)
export class MenuResolver {
  @FieldResolver(() => [String], { nullable: true })
  async items(@Root() menu: Menu): Promise<string[] | null> {
    try {
      const isParent = await Menu.findBy({
        parent: menu.id
      });
      const menus = [];
      if (!isParent) menus.push('');
      else {
        isParent.map((rec: Menu) => {
          menus.push(rec.id);
        });
      }
      return menus;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [Menu])
  @UseMiddleware(isAuth)
  async getAllMenu(): Promise<Menu[]> {
    return await Menu.find({
      where: { type: 'Link' },
      order: { id: 'ASC' }
    });
  }

  @Query(() => [Menu])
  @UseMiddleware(isAuth)
  async getParentMenu(): Promise<Menu[]> {
    return await Menu.find({
      where: { type: 'Dropdown' },
      order: { id: 'ASC' }
    });
  }

  @Query(() => [FieldMenu], { nullable: true })
  @UseMiddleware(isAuth)
  async getMenuSelfAssign(
    @Ctx() { req }: Context
  ): Promise<Record<string, unknown>[]> {
    let result;

    const sqlDept = `select department_alt as "departmentId", username as "ifsUsername" from atj_app_user
                    where username = :username`;
    const dept = await ifs.query(sqlDept, [req.session.username]);

    if (dept[0].departmentId === 'MIS') {
      result = await Menu.find({ order: { id: 'ASC' } });
    } else {
      const sql = `SELECT DISTINCT id AS "id",
                  root AS "root",
                  name AS "name",
                  TYPE AS "type",
                  to_link AS "to",
                  icon AS "icon",
                  parent AS "parent"
              FROM   ATJ_APP_MENU
              START WITH id IN (SELECT menu_id
                                FROM   atj_app_role
                                WHERE  dept = :dept
                                union
                                SELECT title_id
                                FROM   atj_app_role
                                WHERE  dept = :dept
                                union
                                SELECT menu_id
                                FROM   atj_app_user_role
                                WHERE  username = :username
                                union
                                SELECT title_id
                                FROM   atj_app_user_role
                                WHERE  username = :username
                                union
                                select id
                                FROM   ATJ_APP_MENU
                                where  id in (100000))
              CONNECT BY PRIOR parent = id
              ORDER BY id`;

      result = await ifs.query(sql, [
        dept[0].departmentId,
        dept[0].departmentId,
        req.session.username,
        req.session.username
      ]);
    }

    for (const product of result) {
      const checkParent = [];

      for (const check of result) {
        if (check.parent === product.id) {
          checkParent.push(check);
        }
      }

      const menus = [];
      if (!checkParent) menus.push('');
      else {
        checkParent.map((rec: Menu) => {
          menus.push(rec.id);
        });
      }
      product['items'] = menus;
    }
    const finalObj = {
      tags: [
        {
          id: 'Title',
          items: ['a', 'b'],
          root: 'root',
          name: 'Apps',
          type: 'Title',
          to: null,
          icon: null
        }
      ]
    };
    finalObj['tags'] = eval(JSON.stringify(result));

    //console.log(finalObj['tags']);

    const rootTags = [
      ...finalObj.tags
        .map((obj) => obj)
        .filter((tag) => tag.root === 'root' || tag.root === 'branch')
    ];

    //console.log(rootTags);

    const mapChildren = (
      childId: any
    ): Record<string, any> | undefined | any => {
      const tag = find(finalObj.tags, (tag) => tag.id === childId) || null;

      if (tag) {
        if (
          isArray(tag.items) &&
          (tag.items.length > 0 || tag.root !== 'root')
        ) {
          return tag;
        }
      }
    };

    const tagTree = rootTags.map((tag) => {
      tag.items = tag.items.map(mapChildren).filter((tag) => tag !== null);

      return tag;
    });

    //console.log(tagTree);

    for (let i = tagTree.length - 1; i >= 0; i--) {
      if (tagTree[i].root == 'branch') {
        tagTree.splice(i, 1);
      }
    }

    return tagTree;
  }

  @Mutation(() => Menu)
  @UseMiddleware(isAuth)
  async createMenu(@Arg('input') input: MenuInput): Promise<Menu | null> {
    try {
      const sql = `
    BEGIN
    atj_app_menu_api.add_menu_ezio(
      :parent,
      :name,
      :path,
      :icon,
      :outMenuId);
    END;
  `;

      const result = await ifs.query(sql, [
        input.parent,
        input.name,
        input.to,
        input.icon,
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ]);
      const outMenuId = result[0] as number;

      const data = await Menu.findOneBy({
        id: outMenuId
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Menu, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMenu(@Arg('input') input: MenuInput): Promise<Menu | null> {
    try {
      const TTHead = await Menu.findOneBy({
        id: input.id
      });

      if (!TTHead) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      atj_app_menu_api.update_menu_Ezio(
        :id,
        :name,
        :path,
        :icon);
      END;
      `;

      await ifs.query(sql, [input.id, input.name, input.to, input.icon]);

      const data = Menu.findOneBy({
        id: input.id
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Menu)
  @UseMiddleware(isAuth)
  async deleteMenu(@Arg('id') id: number): Promise<Menu> {
    try {
      const tt = await Menu.findOneBy({
        id
      });

      if (!tt) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      atj_app_menu_api.delete_menu_Ezio(
        :id);
      END;
    `;

      await ifs.query(sql, [id]);

      return tt;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
