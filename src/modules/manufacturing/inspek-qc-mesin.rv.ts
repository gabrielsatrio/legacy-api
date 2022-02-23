import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { InspekQcMesin } from './entities/inspek-qc-mesin';
import { InspekQcMesinInput } from './inspek-qc-mesin.in';

@Resolver(InspekQcMesin)
export class InspekMesinResolver {
  @Query(() => [InspekQcMesin], { nullable: true })
  @UseMiddleware(isAuth)
  async getInspekQcMesin(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<InspekQcMesin[] | undefined> {
    return await InspekQcMesin.find({
      contract: In(contract)
    });
  }
  @Mutation(() => InspekQcMesin)
  @UseMiddleware(isAuth)
  async createInspekQcMesin(
    @Arg('input') input: InspekQcMesinInput
  ): Promise<InspekQcMesin> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_INSPEK_MESIN`;
      const result = await getConnection().query(sql);
      const data = InspekQcMesin.create({
        ...input,
        id: result[0].id
      });
      const results = await InspekQcMesin.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => InspekQcMesin, { nullable: true })
  @UseMiddleware(isAuth)
  async updateInspekQcMesin(
    @Arg('input') input: InspekQcMesinInput
  ): Promise<InspekQcMesin> {
    try {
      const data = await InspekQcMesin.findOne({
        id: input.id,
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      InspekQcMesin.merge(data, input);
      const results = await InspekQcMesin.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => InspekQcMesin)
  @UseMiddleware(isAuth)
  async deleteInspekQcMesin(
    @Arg('id') id: number,
    @Arg('contract') contract: string
  ): Promise<InspekQcMesin> {
    try {
      const data = await InspekQcMesin.findOne({
        id,
        contract
      });
      if (!data) throw new Error('No data found.');
      await InspekQcMesin.delete({ id, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
