import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { AfalBraidingInput } from './afal-braiding.in';
import { AfalBraiding } from './entities/afal-braiding';

@Resolver(AfalBraiding)
export class EffBraidingResolver {
  @Query(() => [AfalBraiding], { nullable: true })
  @UseMiddleware(isAuth)
  async getAfalBraiding(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<AfalBraiding[] | undefined> {
    return await AfalBraiding.findBy({
      contract: In(contract)
    });
  }

  @Mutation(() => AfalBraiding)
  @UseMiddleware(isAuth)
  async createAfalBraiding(
    @Arg('input') input: AfalBraidingInput
  ): Promise<AfalBraiding | undefined> {
    try {
      const data = AfalBraiding.create({
        ...input
      });
      const results = await AfalBraiding.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AfalBraiding, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAfalBraiding(
    @Arg('input') input: AfalBraidingInput
  ): Promise<AfalBraiding | undefined | number> {
    try {
      const data = await AfalBraiding.findOneBy({
        contract: input.contract,
        tanggal: input.tanggal
      });
      if (!data) throw new Error('No data found.');
      AfalBraiding.merge(data, { ...input });
      const results = await AfalBraiding.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AfalBraiding)
  @UseMiddleware(isAuth)
  async deleteAfalBraiding(
    @Arg('tanggal') tanggal: Date,
    @Arg('contract') contract: string
  ): Promise<AfalBraiding> {
    try {
      const data = await AfalBraiding.findOneBy({
        contract,
        tanggal
      });
      if (!data) throw new Error('No data found.');
      await AfalBraiding.delete({ tanggal, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
