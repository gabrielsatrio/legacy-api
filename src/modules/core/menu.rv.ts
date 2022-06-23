import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { find, isArray } from 'lodash';
import {
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import FieldMenu from '../../types/field-menu';
import { mapError } from '../../utils/map-error';
import { Menu } from './entities/menu';

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
    return await Menu.find();
  }

  @Query(() => [FieldMenu], { nullable: true })
  @UseMiddleware(isAuth)
  async getMenu(): Promise<Record<string, unknown>[]> {
    const test = await Menu.find({ order: { id: 'ASC' } });

    for (const product of test) {
      const isParent = await Menu.find({
        where: { parent: product.id },
        order: { id: 'ASC' }
      });
      const menus = [];
      if (!isParent) menus.push('');
      else {
        isParent.map((rec: Menu) => {
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
    finalObj['tags'] = eval(JSON.stringify(test));

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

  @Query(() => [FieldMenu], { nullable: true })
  @UseMiddleware(isAuth)
  async getMenuSelfAssign(
    @Ctx() { req }: Context
  ): Promise<Record<string, unknown>[]> {
    let result;

    const sqlDept = `select department_id as "departmentId", ifs_username as "ifsUsername" from atj_app_user
                    where username = :username`;
    const dept = await ifs.query(sqlDept, [req.session.username]);

    console.log(dept[0].departmentId);

    if (dept[0].departmentId === 'MIS') {
      result = await Menu.find({ order: { id: 'ASC' } });
    } else {
      const sql = `SELECT DISTINCT id AS "id",
                  root AS "root",
                  name AS "name",
                  TYPE AS "type",
                  to_link AS "toLink",
                  icon AS "icon",
                  parent AS "parent"
              FROM   ATJ_APP_MENU
              START WITH id IN (SELECT menu_id
                                FROM   atj_app_role
                                WHERE  dept = :dept
                                union
                                SELECT menu_id
                                FROM   atj_app_user_role
                                WHERE  username = :username
                                union
                                select id
                                FROM   ATJ_APP_MENU
                                where  id in (1000,12000))
              CONNECT BY PRIOR parent = id
              ORDER BY id`;
      result = await ifs.query(sql, [
        dept[0].departmentId,
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
}
