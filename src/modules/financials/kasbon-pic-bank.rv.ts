import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { PicBank } from './entities/kasbon-pic-bank';
import { PicBankView } from './entities/kasbon-pic-bank.vw';
import { PicBankInput } from './kasbon-pic-bank.in';

@Resolver(PicBank)
export class PicBankResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkPicBankExist(@Arg('contract') contract: string): Promise<boolean> {
    try {
      return (await this.getPicBank(contract)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [PicBankView])
  @UseMiddleware(isAuth)
  async getAllPicBank(): Promise<PicBankView[] | undefined> {
    try {
      return await PicBankView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => PicBankView, { nullable: true })
  @UseMiddleware(isAuth)
  async getPicBank(
    @Arg('contract') contract: string
  ): Promise<PicBankView | null> {
    try {
      return await PicBankView.findOneBy({ contract });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PicBank)
  @UseMiddleware(isAuth)
  async createPicBank(
    @Arg('input') input: PicBankInput
  ): Promise<PicBank | undefined> {
    try {
      const existingData = await PicBank.findOneBy({
        contract: input.contract
      });
      if (existingData) throw new Error('Data already exists.');
      const data = PicBank.create({
        ...input
      });
      const result = await PicBank.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PicBank, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePicBank(
    @Arg('input') input: PicBankInput
  ): Promise<PicBank | undefined> {
    try {
      const data = await PicBank.findOneBy({
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      PicBank.merge(data, { ...input });
      const result = await PicBank.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => PicBank)
  @UseMiddleware(isAuth)
  async deletePicBank(@Arg('contract') contract: string): Promise<PicBank> {
    try {
      const data = await PicBank.findOneBy({ contract });
      if (!data) throw new Error('No data found.');
      await PicBank.delete({ contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
