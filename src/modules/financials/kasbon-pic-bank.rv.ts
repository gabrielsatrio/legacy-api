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
import { PicBank } from './entities/kasbon-pic-bank';
import { PicBankView } from './entities/kasbon-pic-bank.vw';
import { PicBankInput } from './kasbon-pic-bank.in';

@Resolver(PicBank)
export class PicBankResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkPicBankExist(@Arg('id', () => Int) id: number): Promise<boolean> {
    try {
      return (await this.getPicBank(id)) ? true : false;
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
  async getPicBank(@Arg('id') id: number): Promise<PicBankView | null> {
    try {
      return await PicBankView.findOneBy({ id });
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
        id: input.id
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
        id: input.id
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
  async deletePicBank(@Arg('id', () => Int) id: number): Promise<PicBank> {
    try {
      const data = await PicBank.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await PicBank.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
