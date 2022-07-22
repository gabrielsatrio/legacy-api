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
import { BonMakanWeekdaysInput } from './bon-makan-wdays.in';
import { BonMakanWeekdays } from './entities/bon-makan-wdays';
import { BonMakanWeekdaysView } from './entities/bon-makan-wdays.vw';

@Resolver(BonMakanWeekdays)
export class BonMakanWeekdaysResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkBonMakanWeekdaysExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getBonMakanWeekdays(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [BonMakanWeekdaysView])
  @UseMiddleware(isAuth)
  async getAllBonMakanWeekdays(): Promise<BonMakanWeekdaysView[] | undefined> {
    try {
      return await BonMakanWeekdays.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => BonMakanWeekdaysView, { nullable: true })
  @UseMiddleware(isAuth)
  async getBonMakanWeekdays(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanWeekdaysView | null> {
    try {
      return await BonMakanWeekdaysView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekdays)
  @UseMiddleware(isAuth)
  async createBonMakanWeekdays(
    @Arg('input') input: BonMakanWeekdaysInput
  ): Promise<BonMakanWeekdays | undefined> {
    try {
      const existingData = await BonMakanWeekdays.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = BonMakanWeekdays.create({
        ...input
      });
      const result = await BonMakanWeekdays.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekdays, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBonMakanWeekdays(
    @Arg('input') input: BonMakanWeekdaysInput
  ): Promise<BonMakanWeekdays | undefined> {
    try {
      const data = await BonMakanWeekdays.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      BonMakanWeekdays.merge(data, { ...input });
      const result = await BonMakanWeekdays.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanWeekdays)
  @UseMiddleware(isAuth)
  async deleteBonMakanWeekdays(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanWeekdays> {
    try {
      const data = await BonMakanWeekdays.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await BonMakanWeekdays.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdBonMakanWeekdays(): Promise<number> {
    try {
      const sql = `SELECT ANG_BON_MAKAN_WDAYS_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
