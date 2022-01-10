import { isAuth } from '@/middlewares/is-auth';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from './../../utils/map-error';
import { YarnType } from './entities/yarn-type';
import { YarnTypeInput } from './yarn-type.in';
@Resolver(YarnType)
export class YarnTypeResolver {
  @Query(() => [YarnType], { nullable: true })
  @UseMiddleware(isAuth)
  async getYarnType(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<YarnType[] | undefined> {
    return await YarnType.find({
      contract: In(contract)
    });
  }

  @Mutation(() => YarnType)
  @UseMiddleware(isAuth)
  async createYarnType(
    @Arg('input') input: YarnTypeInput
  ): Promise<YarnType | undefined> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_YARN_TYPE`;
      const result = await getConnection().query(sql);
      const data = YarnType.create({
        ...input,
        id: result[0].id
      });
      const results = await YarnType.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => YarnType, { nullable: true })
  @UseMiddleware(isAuth)
  async updateYarnType(
    @Arg('input') input: YarnTypeInput
  ): Promise<YarnType | undefined> {
    try {
      const data = await YarnType.findOne({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      YarnType.merge(data, input);
      const results = await YarnType.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => YarnType)
  @UseMiddleware(isAuth)
  async deleteYarnType(@Arg('id') id: number): Promise<YarnType> {
    try {
      const data = await YarnType.findOne({
        id
      });
      if (!data) throw new Error('No data found.');
      await YarnType.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
