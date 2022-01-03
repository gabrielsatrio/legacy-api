import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { YarnEff } from './entities/yarn-eff';
import { YarnEffInput } from './yarn-eff.in';
@Resolver(YarnEff)
export class EffBenangResolver {
  @Query(() => [YarnEff], { nullable: true })
  @UseMiddleware(isAuth)
  async getYarnEff(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<YarnEff[] | undefined> {
    return await YarnEff.find({
      contract: In(contract)
    });
  }

  @Mutation(() => YarnEff)
  @UseMiddleware(isAuth)
  async createYarnEff(
    @Arg('input') input: YarnEffInput
  ): Promise<YarnEff | undefined> {
    try {
      const data = YarnEff.create({
        ...input
      });
      const results = await YarnEff.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => YarnEff, { nullable: true })
  @UseMiddleware(isAuth)
  async updateYarnEff(
    @Arg('input') input: YarnEffInput
  ): Promise<YarnEff | undefined> {
    try {
      const data = await YarnEff.findOne({
        objId: input.objId
      });
      if (!data) throw new Error('No data found.');
      YarnEff.merge(data, input);
      const results = await YarnEff.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => YarnEff)
  @UseMiddleware(isAuth)
  async deleteYarnEff(@Arg('objId') objId: string): Promise<YarnEff> {
    try {
      const data = await YarnEff.findOne({
        objId
      });
      if (!data) throw new Error('No data found.');
      await YarnEff.delete({ objId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
