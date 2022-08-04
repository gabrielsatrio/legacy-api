import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { JenisMesinAt2 } from './entities/jenis-mesin';
import { JenisMesinAt2Input } from './jenis-mesin.in';

@Resolver(JenisMesinAt2)
export class JenisMesinResolver {
  @Query(() => [JenisMesinAt2], { nullable: true })
  @UseMiddleware(isAuth)
  async getJenisMesin(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<JenisMesinAt2[] | undefined> {
    return await JenisMesinAt2.findBy({
      contract: In(contract)
    });
  }

  @Mutation(() => JenisMesinAt2)
  @UseMiddleware(isAuth)
  async createJenisMesin(
    @Arg('input') input: JenisMesinAt2Input
  ): Promise<JenisMesinAt2 | undefined> {
    try {
      const check = await JenisMesinAt2.findOneBy({
        contract: input.contract,
        mesin: input.mesin
      });

      if (check) throw new Error('Data Already Exists');

      const data = JenisMesinAt2.create({
        ...input
      });
      const results = await JenisMesinAt2.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => JenisMesinAt2, { nullable: true })
  @UseMiddleware(isAuth)
  async updateJenisMesin(
    @Arg('input') input: JenisMesinAt2Input
  ): Promise<JenisMesinAt2 | undefined | number> {
    try {
      const data = await JenisMesinAt2.findOneBy({
        contract: input.contract,
        mesin: input.mesin
      });
      if (!data) throw new Error('No data found.');
      JenisMesinAt2.merge(data, { ...input });
      const results = await JenisMesinAt2.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => JenisMesinAt2)
  @UseMiddleware(isAuth)
  async deleteJenisMesin(
    @Arg('contract') contract: string,
    @Arg('mesin') mesin: string,
    @Arg('jenis') jenis: string
  ): Promise<JenisMesinAt2> {
    try {
      const data = await JenisMesinAt2.findOneBy({
        contract,
        mesin,
        jenis
      });
      if (!data) throw new Error('No data found.');
      await JenisMesinAt2.delete({
        contract,
        mesin,
        jenis
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
