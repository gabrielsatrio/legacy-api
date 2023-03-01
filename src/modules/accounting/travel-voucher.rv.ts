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
import { TravelVoucher } from './entities/travel-voucher';
import { TravelVoucherView } from './entities/travel-voucher.vw';
import { TravelVoucherInput } from './travel-voucher.in';

@Resolver(TravelVoucher)
export class TravelVoucherResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkTravelVoucherExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getTravelVoucher(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [TravelVoucherView])
  @UseMiddleware(isAuth)
  async getAllTravelVoucher(): Promise<TravelVoucherView[] | undefined> {
    try {
      return await TravelVoucherView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => TravelVoucherView, { nullable: true })
  @UseMiddleware(isAuth)
  async getTravelVoucher(
    @Arg('id', () => Int) id: number
  ): Promise<TravelVoucherView | null> {
    try {
      return await TravelVoucherView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => TravelVoucher)
  @UseMiddleware(isAuth)
  async createTravelVoucher(
    @Arg('input') input: TravelVoucherInput
  ): Promise<TravelVoucher | undefined> {
    try {
      const existingData = await TravelVoucher.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = TravelVoucher.create({
        ...input
      });
      const result = await TravelVoucher.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => TravelVoucher, { nullable: true })
  @UseMiddleware(isAuth)
  async updateTravelVoucher(
    @Arg('input') input: TravelVoucherInput
  ): Promise<TravelVoucher | undefined> {
    try {
      const data = await TravelVoucher.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      TravelVoucher.merge(data, { ...input });
      const result = await TravelVoucher.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => TravelVoucher)
  @UseMiddleware(isAuth)
  async deleteTravelVoucher(
    @Arg('id', () => Int) id: number
  ): Promise<TravelVoucher> {
    try {
      const data = await TravelVoucher.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await TravelVoucher.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => [TravelVoucher], { nullable: true })
  @UseMiddleware(isAuth)
  async generateTravel(
    @Arg('companyOffice') companyOffice: string,
    @Arg('claimNo') claimNo: string
  ): Promise<TravelVoucher[] | null> {
    try {
      const sql = `BEGIN ang_travel_api.insert__(:companyOffice, :claimNo); END;`;

      await ifs.query(sql, [companyOffice, claimNo]);

      const data = await TravelVoucher.findBy({
        contract: companyOffice
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [TravelVoucherView])
  @UseMiddleware(isAuth)
  async getTravelVoucherGenerate(
    @Arg('claimNo') claimNo: string
  ): Promise<TravelVoucherView[] | undefined> {
    try {
      const sql = `
        SELECT id AS "id",
               contract AS "contract",
               dept AS "dept",
               nominal AS "nominal",
               no_account AS "noAccount",
               voucher_no_temp AS "voucherNoTemp",
               voucher_no AS "voucherNo",
               note AS "note",
               claim_no AS "claimNo"
        FROM   ang_travel_v
        WHERE  INSTR(',' || :claimNo || ',', ',' || claim_no || ',') > 0`;

      const result = await ifs.query(sql, [claimNo]);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => [TravelVoucher], { nullable: true })
  @UseMiddleware(isAuth)
  async createTravelVoucherIfs(
    @Arg('voucherDate') voucherDate: Date,
    @Arg('voucherType') voucherType: string,
    @Arg('contract') contract: string,
    @Arg('username') username: string
  ): Promise<TravelVoucher[] | null> {
    try {
      let sql = '';

      if (contract === 'AGT') {
        sql = `BEGIN ang_travel_api.upload_agt(:voucherDate, :voucherType, :contract, :username); END;`;
      } else {
        sql = `BEGIN ang_travel_api.upload(:voucherDate, :voucherType, :contract, :username); END;`;
      }

      await ifs.query(sql, [voucherDate, voucherType, contract, username]);

      const data = await TravelVoucher.findBy({
        contract: contract
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
