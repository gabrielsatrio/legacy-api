import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { EffBraidingInput } from './braiding-output.in';
import { EffBraiding } from './entities/braiding-output';

@Resolver(EffBraiding)
export class EffBraidingResolver {
  @Query(() => [EffBraiding], { nullable: true })
  @UseMiddleware(isAuth)
  async getEffBraiding(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<EffBraiding[] | undefined> {
    return await EffBraiding.findBy({
      contract: In(contract)
    });
  }

  @Mutation(() => EffBraiding)
  @UseMiddleware(isAuth)
  async createEffBraiding(
    @Arg('input') input: EffBraidingInput
  ): Promise<EffBraiding | undefined> {
    try {
      const data = EffBraiding.create({
        ...input
      });
      const results = await EffBraiding.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => EffBraiding, { nullable: true })
  @UseMiddleware(isAuth)
  async updateEffBraiding(
    @Arg('input') input: EffBraidingInput
  ): Promise<EffBraiding | undefined | number> {
    try {
      const data = await EffBraiding.findOneBy({
        contract: input.contract,
        tgl: input.tgl
      });
      if (!data) throw new Error('No data found.');
      EffBraiding.merge(data, { ...input });
      const results = await EffBraiding.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => EffBraiding)
  @UseMiddleware(isAuth)
  async deleteEffBraiding(
    @Arg('tgl') tgl: Date,
    @Arg('contract') contract: string
  ): Promise<EffBraiding> {
    try {
      const data = await EffBraiding.findOneBy({
        contract,
        tgl
      });
      if (!data) throw new Error('No data found.');
      await EffBraiding.delete({ tgl, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
