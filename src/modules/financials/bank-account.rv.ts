import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { BankAccountInput } from './bank-account.in';
import { BankAccount } from './entities/bank-account';
import { BankAccountView } from './entities/bank-account.vw';

@Resolver(BankAccount)
export class BankAccountResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkBankAccountExist(
    @Arg('accountNo') accountNo: string
  ): Promise<boolean> {
    try {
      return (await this.getBankAccount(accountNo)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [BankAccountView])
  @UseMiddleware(isAuth)
  async getAllBankAccount(): Promise<BankAccountView[] | undefined> {
    try {
      return await BankAccount.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => BankAccountView, { nullable: true })
  @UseMiddleware(isAuth)
  async getBankAccount(
    @Arg('accountNo') accountNo: string
  ): Promise<BankAccountView | null> {
    try {
      return await BankAccountView.findOneBy({ accountNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BankAccount)
  @UseMiddleware(isAuth)
  async createBankAccount(
    @Arg('input') input: BankAccountInput
  ): Promise<BankAccount | undefined> {
    try {
      const existingData = await BankAccount.findOneBy({
        accountNo: input.accountNo
      });
      if (existingData) throw new Error('Data already exists.');
      const data = BankAccount.create({
        ...input
      });
      const result = await BankAccount.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BankAccount, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBankAccount(
    @Arg('input') input: BankAccountInput
  ): Promise<BankAccount | undefined> {
    try {
      const data = await BankAccount.findOneBy({
        accountNo: input.accountNo
      });
      if (!data) throw new Error('No data found.');
      BankAccount.merge(data, { ...input });
      const result = await BankAccount.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BankAccount)
  @UseMiddleware(isAuth)
  async deleteBankAccount(
    @Arg('accountNo') accountNo: string
  ): Promise<BankAccount> {
    try {
      const data = await BankAccount.findOneBy({ accountNo });
      if (!data) throw new Error('No data found.');
      await BankAccount.delete({ accountNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
