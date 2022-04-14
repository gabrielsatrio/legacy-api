import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { BPPFInput } from './bppf.in';
import { BPPF } from './entities/bppf';

@Resolver(BPPF)
export class BPPFResolver {
  @Query(() => [BPPF], { nullable: true })
  @UseMiddleware(isAuth)
  async getBPPF(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<BPPF[] | undefined> {
    return await BPPF.findBy({
      contract: In(contract)
    });
  }

  @Mutation(() => BPPF)
  @UseMiddleware(isAuth)
  async createBPPF(@Arg('input') input: BPPFInput): Promise<BPPF | undefined> {
    try {
      const sql = `SELECT nvl(max(id_no)+1,1) as "id" from CHR_BPPF`;
      const result = await ifs.query(sql);
      const data = BPPF.create({
        ...input,
        idNo: result[0].id
      });
      const results = await BPPF.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BPPF, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBPPF(
    @Arg('input') input: BPPFInput
  ): Promise<BPPF | undefined | number> {
    try {
      const data = await BPPF.findOneBy({
        contract: input.contract,
        idNo: input.idNo
      });
      if (!data) throw new Error('No data found.');
      BPPF.merge(data, { ...input });
      const results = await BPPF.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BPPF)
  @UseMiddleware(isAuth)
  async deleteBPPF(
    @Arg('idNo', () => Int) idNo: number,
    @Arg('contract') contract: string
  ): Promise<BPPF> {
    try {
      const data = await BPPF.findOneBy({
        idNo,
        contract
      });
      if (!data) throw new Error('No data found.');
      await BPPF.delete({ idNo, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
