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
import { FakturPajak } from './entities/faktur-pajak';
import { FakturPajakView } from './entities/faktur-pajak.vw';
import { FakturPajakInput } from './faktur-pajak.in';

@Resolver(FakturPajak)
export class FakturPajakResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkFakturPajakExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getFakturPajak(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [FakturPajakView])
  @UseMiddleware(isAuth)
  async getAllFakturPajak(): Promise<FakturPajakView[] | undefined> {
    try {
      return await FakturPajakView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => FakturPajakView, { nullable: true })
  @UseMiddleware(isAuth)
  async getFakturPajak(
    @Arg('id', () => Int) id: number
  ): Promise<FakturPajakView | null> {
    try {
      return await FakturPajakView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => FakturPajak)
  @UseMiddleware(isAuth)
  async createFakturPajak(
    @Arg('input') input: FakturPajakInput
  ): Promise<FakturPajak | undefined> {
    try {
      const existingData = await FakturPajak.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = FakturPajak.create({
        ...input
      });
      const result = await FakturPajak.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => FakturPajak, { nullable: true })
  @UseMiddleware(isAuth)
  async updateFakturPajak(
    @Arg('input') input: FakturPajakInput
  ): Promise<FakturPajak | undefined> {
    try {
      const data = await FakturPajak.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      FakturPajak.merge(data, { ...input });
      const result = await FakturPajak.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => FakturPajak)
  @UseMiddleware(isAuth)
  async deleteFakturPajak(
    @Arg('id', () => Int) id: number
  ): Promise<FakturPajak> {
    try {
      const data = await FakturPajak.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await FakturPajak.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => [FakturPajak], { nullable: true })
  @UseMiddleware(isAuth)
  async generateNomorSJ(
    @Arg('period') period: Date,
    @Arg('until') until: Date,
    @Arg('contract') contract: string,
    @Arg('customerNo') customerNo: string,
    @Arg('associationNo') associationNo: string
  ): Promise<FakturPajak[] | null> {
    try {
      const sql = `
    BEGIN
    ang_faktur_pajak_api.generate(
      :period,
      :until,
      :contract,
      :customerNo,
      :associationNo);
    END;
  `;

      await ifs.query(sql, [
        period,
        until,
        contract,
        customerNo,
        associationNo
      ]);

      const data = await FakturPajak.findBy({
        contract: contract,
        customerNo: customerNo,
        associationNo: associationNo
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [FakturPajakView])
  @UseMiddleware(isAuth)
  async getFakturPajakGenerate(
    @Arg('period') period: Date,
    @Arg('until') until: Date,
    @Arg('contract') contract: string,
    @Arg('customerNo') customerNo: string,
    @Arg('associationNo') associationNo: string
  ): Promise<FakturPajakView[] | undefined> {
    try {
      const sql = `
        SELECT id AS "id",
               kode_faktur AS "kodeFaktur",
               contract AS "contract",
               association_no AS "associationNo",
               customer_no AS "customerNo",
               customer_name AS "customerName",
               date_delivered AS "dateDelivered",
               no_sj AS "noSj"
        FROM   ang_faktur_pajak_v
        WHERE  trunc(date_delivered) BETWEEN trunc(:period) AND trunc(:until)
               AND contract = :contract
               AND customer_no like :customerNo
               AND association_no like :associationNo`;

      const result = await ifs.query(sql, [
        period,
        until,
        contract,
        customerNo,
        associationNo
      ]);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
