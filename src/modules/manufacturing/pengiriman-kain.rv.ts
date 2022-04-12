import { ifs } from '@/config/data-sources';
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
import { PengirimanKain } from './entities/pengiriman-kain';
import { PengirimanKainInput } from './pengiriman-kain.in';

@Resolver(PengirimanKain)
export class PengirimanKainResolver {
  @Query(() => [PengirimanKain], { nullable: true })
  @UseMiddleware(isAuth)
  async getPengirimanKain(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<PengirimanKain[] | undefined> {
    return await PengirimanKain.findBy({
      contract: In(contract)
    });
  }
  @Mutation(() => PengirimanKain)
  @UseMiddleware(isAuth)
  async createPengirimanKain(
    @Arg('input') input: PengirimanKainInput,
    @Ctx() { req }: Context
  ): Promise<PengirimanKain> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_PENGIRIMAN_KAIN`;
      const result = await ifs.query(sql);
      const data = PengirimanKain.create({
        ...input,
        createdAt: new Date(),
        createdBy: req.session.username,
        id: result[0].id
      });
      const results = await PengirimanKain.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PengirimanKain, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePengirimanKain(
    @Arg('input') input: PengirimanKainInput
  ): Promise<PengirimanKain> {
    try {
      const data = await PengirimanKain.findOneBy({
        id: input.id,
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      PengirimanKain.merge(data, { ...input });
      const results = await PengirimanKain.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PengirimanKain)
  @UseMiddleware(isAuth)
  async deletePengirimanKain(
    @Arg('id') id: number,
    @Arg('contract') contract: string
  ): Promise<PengirimanKain> {
    try {
      const data = await PengirimanKain.findOneBy({
        id,
        contract
      });
      if (!data) throw new Error('No data found.');
      await PengirimanKain.delete({ id, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
