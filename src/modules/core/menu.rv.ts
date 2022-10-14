import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { MenuItem } from '@/types/graphql/menu-item';
import { Route } from '@/types/graphql/route';
import { mapError } from '@/utils/map-error';
import find from 'lodash/find';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
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
import { Menu } from './entities/menu';
import { MenuInput } from './menu.in';

@Resolver(Menu)
export class MenuResolver {
  @FieldResolver(() => [String], { nullable: true })
  async items(@Root() menu: Menu): Promise<string[] | null> {
    try {
      const isParent = await Menu.findBy({ parent: menu.id });
      const menus = [];
      if (!isParent) {
        menus.push('');
      } else {
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
    try {
      const result = await Menu.find({
        where: { type: 'Link' },
        order: { id: 'ASC' }
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [Menu])
  @UseMiddleware(isAuth)
  async getParentMenu(): Promise<Menu[]> {
    try {
      const result = await Menu.find({
        where: { type: 'Dropdown' },
        order: { id: 'ASC' }
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [Route], { nullable: true })
  async getValidRoute(@Ctx() { req }: Context): Promise<Route> {
    let result;
    let sql = `
      SELECT  department_alt  AS "departmentId",
              username        AS "ifsUsername"
      FROM    atj_app_user
      WHERE   username = :username
    `;
    const res = await ifs.query(sql, [req.session.username]);
    if (!isEmpty(res)) {
      if (res[0].departmentId === 'MIS') {
        sql = `
        SELECT  to_link AS "to"
        FROM    atj_app_menu
        WHERE   type = 'Link'
        union
        SELECT to_link AS "to"
        FROM   atj_app_gen_route
      `;
        result = await ifs.query(sql);
      } else {
        sql = `
        SELECT  to_link AS "to"
        FROM    atj_app_menu
        WHERE   id IN (
          SELECT  menu_id
          FROM    atj_app_role
          WHERE   dept = :dept
          UNION
          SELECT  menu_id
          FROM    atj_app_user_role
          WHERE   username = :username
        )
        union
        SELECT to_link AS "to"
        FROM   atj_app_gen_route
      `;
        result = await ifs.query(sql, [
          res[0].departmentId,
          req.session.username
        ]);
      }
    }
    return result;
  }

  @Query(() => [MenuItem], { nullable: true })
  @UseMiddleware(isAuth)
  async getMenuSelfAssign(
    @Ctx() { req }: Context
  ): Promise<Record<string, unknown>[]> {
    let result;
    let sql = `
      SELECT  department_alt  AS "departmentId",
              username        AS "ifsUsername"
      FROM    atj_app_user
      WHERE username = :username
    `;
    const res = await ifs.query(sql, [req.session.username]);
    if (res[0].departmentId === 'MIS') {
      result = await Menu.find({ order: { id: 'ASC' } });
    } else {
      sql = `
        SELECT  DISTINCT id      AS "id",
                         root    AS "root",
                         name    AS "name",
                         type    AS "type",
                         to_link AS "to",
                         icon    AS "icon",
                         parent  AS "parent"
        FROM   atj_app_menu
        START WITH id IN (SELECT menu_id
                          FROM   atj_app_role
                          WHERE  dept = :dept
                          UNION
                          SELECT title_id
                          FROM   atj_app_role
                          WHERE  dept = :dept
                          UNION
                          SELECT menu_id
                          FROM   atj_app_user_role
                          WHERE  username = :username
                          UNION
                          SELECT title_id
                          FROM   atj_app_user_role
                          WHERE  username = :username
                          UNION
                          select id
                          FROM   ATJ_APP_MENU
                          where  id in (100000))
        CONNECT BY PRIOR parent = id
        ORDER BY id
      `;
      result = await ifs.query(sql, [
        res[0].departmentId,
        res[0].departmentId,
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
      if (!checkParent) {
        menus.push('');
      } else {
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
    const rootTags = [
      ...finalObj.tags
        .map((obj) => obj)
        .filter((tag) => tag.root === 'root' || tag.root === 'branch')
    ];
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
          ATJ_App_Menu_API.Add_menu_EZIO(
            :parent,
            :name,
            :path,
            :icon,
            :outMenuId);
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
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
      const data = await Menu.findOneBy({ id: input.id });
      if (!data) throw new Error('No data found.');
      const sql = `
        BEGIN
          ATJ_App_Menu_API.Update_Menu_EZIO(
            :id,
            :name,
            :path,
            :icon);
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      await ifs.query(sql, [input.id, input.name, input.to, input.icon]);
      const result = Menu.findOneBy({ id: input.id });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Menu)
  @UseMiddleware(isAuth)
  async deleteMenu(@Arg('id') id: number): Promise<Menu> {
    try {
      const data = await Menu.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      const sql = `
        BEGIN
          ATJ_App_Menu_API.Delete_Menu_EZIO(:id);
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      await ifs.query(sql, [id]);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
