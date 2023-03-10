import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { BenangSisaInput } from './benang-sisa.in';
import { BenangSisa } from './entities/benang-sisa';

@Resolver(BenangSisa)
export class BenangSisaResolver {
  @Query(() => [BenangSisa], { nullable: true })
  @UseMiddleware(isAuth)
  async getBenangSisa(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('department') department: string
  ): Promise<BenangSisa[] | undefined> {
    return await BenangSisa.findBy({
      contract: In(contract),
      department
    });
  }

  @Mutation(() => BenangSisa)
  @UseMiddleware(isAuth)
  async createBenangSisa(
    @Arg('input') input: BenangSisaInput,
    @Ctx() { req }: Context
  ): Promise<BenangSisa | undefined> {
    try {
      const check = await BenangSisa.findOneBy({
        contract: input.contract,
        tanggal: input.tanggal,
        noPalet: input.noPalet,
        noDus: input.noDus,
        department: input.department
      });

      const sql = `select department_id as "department" from atj_app_user
      where username = :p_username`;
      const username = await ifs.query(sql, [req.session.username]);

      if (check) throw new Error('Data Already Exists');

      const data = BenangSisa.create({
        ...input,
        department: username[0].department
      });
      const results = await BenangSisa.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BenangSisa, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBenangSisa(
    @Arg('input') input: BenangSisaInput
  ): Promise<BenangSisa | undefined | number> {
    try {
      const data = await BenangSisa.findOneBy({
        contract: input.contract,
        tanggal: input.tanggal,
        noPalet: input.noPalet,
        noDus: input.noDus,
        department: input.department
      });
      if (!data) throw new Error('No data found.');
      BenangSisa.merge(data, { ...input });
      const results = await BenangSisa.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BenangSisa)
  @UseMiddleware(isAuth)
  async deleteBenangSisa(
    @Arg('contract') contract: string,
    @Arg('tanggal') tanggal: Date,
    @Arg('noPalet') noPalet: string,
    @Arg('noDus', () => Int) noDus: number,
    @Arg('department') department: string
  ): Promise<BenangSisa> {
    try {
      const data = await BenangSisa.findOneBy({
        contract,
        tanggal,
        noPalet,
        noDus,
        department
      });
      if (!data) throw new Error('No data found.');
      await BenangSisa.delete({
        contract,
        tanggal,
        noPalet,
        noDus,
        department
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
