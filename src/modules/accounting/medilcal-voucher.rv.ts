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
import { MedicalVoucher } from './entities/medical-voucher';
import { MedicalVoucherView } from './entities/medical-voucher.vw';
import { MedicalVoucherInput } from './medical-voucher.in';

@Resolver(MedicalVoucher)
export class MedicalVoucherResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkMedicalVoucherExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getMedicalVoucher(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MedicalVoucherView])
  @UseMiddleware(isAuth)
  async getAllMedicalVoucher(): Promise<MedicalVoucherView[] | undefined> {
    try {
      return await MedicalVoucherView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => MedicalVoucherView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMedicalVoucher(
    @Arg('id', () => Int) id: number
  ): Promise<MedicalVoucherView | null> {
    try {
      return await MedicalVoucherView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MedicalVoucher)
  @UseMiddleware(isAuth)
  async createMedicalVoucher(
    @Arg('input') input: MedicalVoucherInput
  ): Promise<MedicalVoucher | undefined> {
    try {
      const existingData = await MedicalVoucher.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = MedicalVoucher.create({
        ...input
      });
      const result = await MedicalVoucher.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MedicalVoucher, { nullable: true })
  @UseMiddleware(isAuth)
  async updateMedicalVoucher(
    @Arg('input') input: MedicalVoucherInput
  ): Promise<MedicalVoucher | undefined> {
    try {
      const data = await MedicalVoucher.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      MedicalVoucher.merge(data, { ...input });
      const result = await MedicalVoucher.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MedicalVoucher)
  @UseMiddleware(isAuth)
  async deleteMedicalVoucher(
    @Arg('id', () => Int) id: number
  ): Promise<MedicalVoucher> {
    try {
      const data = await MedicalVoucher.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await MedicalVoucher.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => [MedicalVoucher], { nullable: true })
  @UseMiddleware(isAuth)
  async generateMedical(
    @Arg('companyOffice') companyOffice: string,
    @Arg('period') period: Date,
    @Arg('until') until: Date
  ): Promise<MedicalVoucher[] | null> {
    try {
      const sql = `BEGIN ang_medical_api.insert__(:companyOffice, :period, :until); END;`;

      await ifs.query(sql, [companyOffice, period, until]);

      const data = await MedicalVoucher.findBy({
        contract: companyOffice
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MedicalVoucherView])
  @UseMiddleware(isAuth)
  async getMedicalVoucherGenerate(
    @Arg('companyOffice') companyOffice: string,
    @Arg('period') period: Date,
    @Arg('until') until: Date
  ): Promise<MedicalVoucherView[] | undefined> {
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
               tgl_settled AS "tglSettled"
        FROM   ang_medical_v
        WHERE  contract = :companyOffice
               AND tgl_settled between trunc(period) and trunc(until)`;

      const result = await ifs.query(sql, [companyOffice, period, until]);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => [MedicalVoucher], { nullable: true })
  @UseMiddleware(isAuth)
  async createMedicalVoucherIfs(
    @Arg('voucherDate') voucherDate: Date,
    @Arg('contract') contract: string,
    @Arg('username') username: string
  ): Promise<MedicalVoucher[] | null> {
    try {
      let sql = '';

      if (contract === 'AGT') {
        sql = `BEGIN ang_medical_api.upload_agt(:voucherDate, :contract, :username); END;`;
      } else {
        sql = `BEGIN ang_medical_api.upload(:voucherDate, :contract, :username); END;`;
      }

      await ifs.query(sql, [voucherDate, contract, username]);

      const data = await MedicalVoucher.findBy({
        contract: contract
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
