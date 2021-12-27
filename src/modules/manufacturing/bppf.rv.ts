import { isAuth } from '@/middlewares/is-auth';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from '../../utils/map-error';
import { BPPFInput } from './bppf.in';
import { BPPF } from './entities/bppf';

@Resolver(BPPF)
export class BPPFResolver {
  @Query(() => [BPPF], { nullable: true })
  @UseMiddleware(isAuth)
  async getBPPF(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<BPPF[] | undefined> {
    return await BPPF.find({
      contract: In(contract)
    });
  }

  @Mutation(() => BPPF)
  @UseMiddleware(isAuth)
  async createBPPF(@Arg('input') input: BPPFInput): Promise<BPPF | undefined> {
    const sql = `SELECT nvl(max(id_no)+1,1) as "id" from CHR_BPPF`;
    const result = await getConnection().query(sql);

    try {
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
      const data = await BPPF.findOne({
        contract: input.contract,
        idNo: input.idNo
      });
      if (!data) throw new Error('No data found.');
      BPPF.merge(data, input);
      const results = await BPPF.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BPPF)
  @UseMiddleware(isAuth)
  async deleteBPPF(
    @Arg('idNo') idNo: number,
    @Arg('contract') contract: string
  ): Promise<BPPF> {
    try {
      const data = await BPPF.findOne({
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
