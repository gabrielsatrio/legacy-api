import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { BenangSisaDoInput } from './benang-sisa-do.in';
import { BenangSisaDo } from './entities/benang-sisa-do';

@Resolver(BenangSisaDo)
export class BenangSisaDoResolver {
  @Query(() => [BenangSisaDo], { nullable: true })
  @UseMiddleware(isAuth)
  async getBenangSisaDo(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('department') department: string
  ): Promise<BenangSisaDo[] | undefined> {
    return await BenangSisaDo.findBy({
      contract: In(contract),
      department
    });
  }

  @Mutation(() => BenangSisaDo)
  @UseMiddleware(isAuth)
  async createBenangSisaDo(
    @Arg('input') input: BenangSisaDoInput,
    @Ctx() { req }: Context
  ): Promise<BenangSisaDo | undefined> {
    try {
      const check = await BenangSisaDo.findOneBy({
        contract: input.contract,
        tanggal: input.tanggal,
        department: input.department
      });

      if (check) throw new Error('Data Already Exists');

      const sqlUser = `select department_id as "department" from atj_app_user
        where username = :p_username`;
      const username = await ifs.query(sqlUser, [req.session.username]);

      const data = BenangSisaDo.create({
        ...input,
        department: username[0].department
      });
      const results = await BenangSisaDo.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BenangSisaDo, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBenangSisaDo(
    @Arg('input') input: BenangSisaDoInput
  ): Promise<BenangSisaDo | undefined | number> {
    try {
      const data = await BenangSisaDo.findOneBy({
        contract: input.contract,
        tanggal: input.tanggal,
        department: input.department
      });
      if (!data) throw new Error('No data found.');
      BenangSisaDo.merge(data, { ...input });
      const results = await BenangSisaDo.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BenangSisaDo)
  @UseMiddleware(isAuth)
  async deleteBenangSisaDo(
    @Arg('contract') contract: string,
    @Arg('tanggal') tanggal: Date,
    @Arg('department') department: string
  ): Promise<BenangSisaDo> {
    try {
      const data = await BenangSisaDo.findOneBy({
        contract,
        tanggal,
        department
      });
      if (!data) throw new Error('No data found.');
      await BenangSisaDo.delete({ contract, tanggal, department });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
