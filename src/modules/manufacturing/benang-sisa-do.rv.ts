import { ifs } from '@/config/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { BenangSisaDoInput } from './benang-sisa-do.in';
import { BenangSisaDo } from './entities/benang-sisa-do';

@Resolver(BenangSisaDo)
export class BenangSisaDoResolver {
  @Query(() => [BenangSisaDo], { nullable: true })
  @UseMiddleware(isAuth)
  async getBenangSisaDo(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<BenangSisaDo[] | undefined> {
    return await BenangSisaDo.findBy({
      contract: In(contract)
    });
  }

  @Mutation(() => BenangSisaDo)
  @UseMiddleware(isAuth)
  async createBenangSisaDo(
    @Arg('input') input: BenangSisaDoInput
  ): Promise<BenangSisaDo | undefined> {
    try {
      const check = await BenangSisaDo.findOneBy({
        contract: input.contract,
        tanggal: input.tanggal
      });

      if (check) throw new Error('Data Already Exists');

      const sql = `select count(*) as "total" from CHR_BENANG_SISA_DO
      where extract ( year from tanggal) = extract ( year from :p_date)
      and extract ( month from tanggal) = extract ( month from :p_date)
      and contract = :p_contract`;
      const result = await ifs.query(sql, [
        input.tanggal,
        input.tanggal,
        input.contract
      ]);

      if (result[0].total !== 0)
        throw new Error('DO untuk bulan terkait sudah ada');

      const data = BenangSisaDo.create({
        ...input
      });
      const results = await BenangSisaDo.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BenangSisaDo, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBenangSisaDo(
    @Arg('input') input: BenangSisaDoInput
  ): Promise<BenangSisaDo | undefined | number> {
    try {
      const data = await BenangSisaDo.findOneBy({
        contract: input.contract,
        tanggal: input.tanggal
      });
      if (!data) throw new Error('No data found.');
      BenangSisaDo.merge(data, { ...input });
      const results = await BenangSisaDo.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BenangSisaDo)
  @UseMiddleware(isAuth)
  async deleteBenangSisaDo(
    @Arg('contract') contract: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<BenangSisaDo> {
    try {
      const data = await BenangSisaDo.findOneBy({
        contract,
        tanggal
      });
      if (!data) throw new Error('No data found.');
      await BenangSisaDo.delete({ contract, tanggal });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
