import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { InspekQcSpeed } from './entities/inspek-qc-speed';
import { InspekQcSpeedInput } from './inspek-qc-speed.in';

@Resolver(InspekQcSpeed)
export class InspekSpeedResolver {
  @Query(() => [InspekQcSpeed], { nullable: true })
  @UseMiddleware(isAuth)
  async getInspekQcSpeed(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<InspekQcSpeed[] | undefined> {
    return await InspekQcSpeed.findBy({
      contract: In(contract)
    });
  }
  @Mutation(() => InspekQcSpeed)
  @UseMiddleware(isAuth)
  async createInspekQcSpeed(
    @Arg('input') input: InspekQcSpeedInput
  ): Promise<InspekQcSpeed> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_INSPEK_SPEED`;
      const result = await ifs.query(sql);
      const data = InspekQcSpeed.create({
        ...input,
        id: result[0].id
      });
      const results = await InspekQcSpeed.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => InspekQcSpeed, { nullable: true })
  @UseMiddleware(isAuth)
  async updateInspekQcSpeed(
    @Arg('input') input: InspekQcSpeedInput
  ): Promise<InspekQcSpeed> {
    try {
      const data = await InspekQcSpeed.findOneBy({
        contract: input.contract,
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      InspekQcSpeed.merge(data, { ...input });
      const results = await InspekQcSpeed.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => InspekQcSpeed)
  @UseMiddleware(isAuth)
  async deleteInspekQcSpeed(
    @Arg('id') id: number,
    @Arg('contract') contract: string
  ): Promise<InspekQcSpeed> {
    try {
      const data = await InspekQcSpeed.findOneBy({
        id,
        contract
      });
      if (!data) throw new Error('No data found.');
      await InspekQcSpeed.delete({ id, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
