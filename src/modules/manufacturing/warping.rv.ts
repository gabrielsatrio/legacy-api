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
import { getConnection, In } from 'typeorm';
import { ProdWarping } from './entities/warping';
import { ProdWarpingInput } from './warping.in';

@Resolver(ProdWarping)
export class ProdWarpingResolver {
  @Query(() => [ProdWarping], { nullable: true })
  @UseMiddleware(isAuth)
  async getProdWarping(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<ProdWarping[] | undefined> {
    return await ProdWarping.find({
      contract: In(contract)
    });
  }

  @Mutation(() => ProdWarping)
  @UseMiddleware(isAuth)
  async createProdWarping(
    @Arg('input') input: ProdWarpingInput,
    @Ctx() { req }: Context
  ): Promise<ProdWarping> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_PROD_WARPING`;
      const result = await getConnection().query(sql);
      const data = ProdWarping.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date(),
        id: result[0].id
      });
      const results = await ProdWarping.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarping, { nullable: true })
  @UseMiddleware(isAuth)
  async updateProdWarping(
    @Arg('input') input: ProdWarpingInput
  ): Promise<ProdWarping> {
    try {
      const data = await ProdWarping.findOne({
        id: input.id,
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      ProdWarping.merge(data, input);
      const results = await ProdWarping.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarping)
  @UseMiddleware(isAuth)
  async deleteProdWarping(
    @Arg('id') id: number,
    @Arg('contract') contract: string
  ): Promise<ProdWarping> {
    try {
      const data = await ProdWarping.findOne({
        id,
        contract
      });
      if (!data) throw new Error('No data found.');
      await ProdWarping.delete({ id, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
