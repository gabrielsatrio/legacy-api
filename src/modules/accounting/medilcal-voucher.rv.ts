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
}
