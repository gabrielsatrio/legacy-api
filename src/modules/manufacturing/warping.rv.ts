import { ifs } from '@/database/data-sources';
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
import { ProdWarping } from './entities/warping';
import { ProdWarpingView } from './entities/warping.vw';
import { ProdWarpingInput } from './warping.in';

@Resolver(ProdWarping)
export class ProdWarpingResolver {
  @Query(() => [ProdWarping], { nullable: true })
  @UseMiddleware(isAuth)
  async getProdWarping(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<ProdWarping[] | undefined> {
    return await ProdWarping.findBy({
      contract: In(contract)
    });
  }

  @Query(() => [ProdWarpingView], { nullable: true })
  @UseMiddleware(isAuth)
  async getProdWarpingView(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<ProdWarpingView[] | undefined> {
    return await ProdWarpingView.findBy({
      contract: In(contract)
    });
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getFyPartNo(@Arg('dopId') dopId: string): Promise<string> {
    try {
      const sql = `SELECT FY_PART_NO as "fyPartNo" FROM JIN_QR_6012_V WHERE DOP_ID = :dopId`;
      const result = await ifs.query(sql, [dopId]);
      return result[0].fyPartNo;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getCompPart(
    @Arg('partNo') partNo: string,
    @Arg('contract') contract: string
  ): Promise<string> {
    try {
      const sql = `select component_part as "componentPart" from prod_structure where contract = :contract and part_no = :partNo`;
      const result = await ifs.query(sql, [contract, partNo]);
      return result[0].componentPart;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getJumlahHelaiLusi(@Arg('partDesc') partDesc: string): Promise<string> {
    try {
      const sql = `SELECT SUBSTR(:partDesc, INSTR(:partDesc,' ',-1) + 1) as "jumlahHelaiLusi"
      FROM dual`;
      const result = await ifs.query(sql, [partDesc]);
      return result[0].jumlahHelaiLusi;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ProdWarping)
  @UseMiddleware(isAuth)
  async createProdWarping(
    @Arg('input') input: ProdWarpingInput,
    @Ctx() { req }: Context
  ): Promise<ProdWarping> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_PROD_WARPING`;
      const result = await ifs.query(sql);
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
      const data = await ProdWarping.findOneBy({
        id: input.id,
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      ProdWarping.merge(data, { ...input });
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
      const data = await ProdWarping.findOneBy({
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
