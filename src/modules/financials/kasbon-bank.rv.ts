import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { BankKasbon } from './entities/kasbon-bank';
import { BankKasbonView } from './entities/kasbon-bank.vw';
import { BankKasbonInput } from './kasbon-bank.in';

@Resolver(BankKasbon)
export class BankKasbonResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkBankKasbonExist(@Arg('bank') bank: string): Promise<boolean> {
    try {
      return (await this.getBankKasbon(bank)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [BankKasbonView])
  @UseMiddleware(isAuth)
  async getAllBankKasbon(): Promise<BankKasbonView[] | undefined> {
    try {
      return await BankKasbonView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => BankKasbonView, { nullable: true })
  @UseMiddleware(isAuth)
  async getBankKasbon(
    @Arg('bank') bank: string
  ): Promise<BankKasbonView | null> {
    try {
      return await BankKasbonView.findOneBy({ bank });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BankKasbon)
  @UseMiddleware(isAuth)
  async createBankKasbon(
    @Arg('input') input: BankKasbonInput
  ): Promise<BankKasbon | undefined> {
    try {
      const existingData = await BankKasbon.findOneBy({
        bank: input.bank
      });
      if (existingData) throw new Error('Data already exists.');
      const data = BankKasbon.create({
        ...input
      });
      const result = await BankKasbon.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BankKasbon, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBankKasbon(
    @Arg('input') input: BankKasbonInput
  ): Promise<BankKasbon | undefined> {
    try {
      const data = await BankKasbon.findOneBy({
        bank: input.bank
      });
      if (!data) throw new Error('No data found.');
      BankKasbon.merge(data, { ...input });
      const result = await BankKasbon.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BankKasbon)
  @UseMiddleware(isAuth)
  async deleteBankKasbon(@Arg('bank') bank: string): Promise<BankKasbon> {
    try {
      const data = await BankKasbon.findOneBy({ bank });
      if (!data) throw new Error('No data found.');
      await BankKasbon.delete({ bank });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
