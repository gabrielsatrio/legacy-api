import { Context } from '@/types/context';
import oracledb from 'oracledb';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { ifs } from '../../database/data-sources';
import { isAuth } from '../../middlewares/is-auth';
import { mapError } from '../../utils/map-error';
import { KontrolBakuBenang } from './entities/kontrol-baku-benang';
import { KontrolBakuBenangInput } from './kontrol-baku-benang.in';

@Resolver(KontrolBakuBenang)
export class KontrolBakuBenangResolver {
  @Query(() => [KontrolBakuBenang], { nullable: true })
  @UseMiddleware(isAuth)
  async getKontrolBakuBenangByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<KontrolBakuBenang[] | undefined> {
    return await KontrolBakuBenang.findBy({
      contract: In(contract)
    });
  }

  @Query(() => KontrolBakuBenang, { nullable: true })
  @UseMiddleware(isAuth)
  async getKontrolBakuBenang(
    @Arg('id', () => Number) id: number
  ): Promise<KontrolBakuBenang | null> {
    return await KontrolBakuBenang.findOneBy({
      id
    });
  }

  @Query(() => KontrolBakuBenang, { nullable: true })
  @UseMiddleware(isAuth)
  async getKontrolBakuBenangByOrderNo(
    @Arg('orderNo', () => String) orderNo: string
  ): Promise<KontrolBakuBenang | null> {
    return await KontrolBakuBenang.findOneBy({
      orderNo
    });
  }

  @Mutation(() => KontrolBakuBenang)
  @UseMiddleware(isAuth)
  async createKontrolBakuBenang(
    @Arg('input') input: KontrolBakuBenangInput,
    @Ctx() { req }: Context
  ): Promise<KontrolBakuBenang | null> {
    try {
      const createdBy: string = req.session.username;
      const sql = `BEGIN GBR_KONTROL_BAKU_BENANG_API.INSERT__(:contract, :orderNo, :orderType, :doDate, :createdBy, :createdAt, :updatedAt, :outId); END;`;

      const result = await ifs.query(sql, [
        input.contract,
        input.orderNo,
        input.orderType,
        input.doDate,
        createdBy,
        new Date(),
        new Date(),
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outId = result[0] as number;
      const data = KontrolBakuBenang.findOneBy({ id: outId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => KontrolBakuBenang, { nullable: true })
  @UseMiddleware(isAuth)
  async updateKontrolBakuBenang(
    @Arg('input') input: KontrolBakuBenangInput
  ): Promise<KontrolBakuBenang | undefined> {
    try {
      const data = await KontrolBakuBenang.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      KontrolBakuBenang.merge(data, { ...input });
      const result = await KontrolBakuBenang.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => KontrolBakuBenang)
  @UseMiddleware(isAuth)
  async deleteKontrolBakuBenang(
    @Arg('id') id: number
  ): Promise<KontrolBakuBenang> {
    try {
      const data = await KontrolBakuBenang.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await KontrolBakuBenang.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
