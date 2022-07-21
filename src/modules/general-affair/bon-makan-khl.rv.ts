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
import { BonMakanKhlInput } from './bon-makan-khl.in';
import { BonMakanKhl } from './entities/bon-makan-khl';
import { BonMakanKhlView } from './entities/bon-makan-khl.vw';

@Resolver(BonMakanKhl)
export class BonMakanKhlResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkBonMakanKhlExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getBonMakanKhl(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [BonMakanKhlView])
  @UseMiddleware(isAuth)
  async getAllBonMakanKhl(): Promise<BonMakanKhlView[] | undefined> {
    try {
      return await BonMakanKhl.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => BonMakanKhlView, { nullable: true })
  @UseMiddleware(isAuth)
  async getBonMakanKhl(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanKhlView | null> {
    try {
      return await BonMakanKhlView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanKhl)
  @UseMiddleware(isAuth)
  async createBonMakanKhl(
    @Arg('input') input: BonMakanKhlInput
  ): Promise<BonMakanKhl | undefined> {
    try {
      const existingData = await BonMakanKhl.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = BonMakanKhl.create({
        ...input
      });
      const result = await BonMakanKhl.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanKhl, { nullable: true })
  @UseMiddleware(isAuth)
  async updateBonMakanKhl(
    @Arg('input') input: BonMakanKhlInput
  ): Promise<BonMakanKhl | undefined> {
    try {
      const data = await BonMakanKhl.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      BonMakanKhl.merge(data, { ...input });
      const result = await BonMakanKhl.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => BonMakanKhl)
  @UseMiddleware(isAuth)
  async deleteBonMakanKhl(
    @Arg('id', () => Int) id: number
  ): Promise<BonMakanKhl> {
    try {
      const data = await BonMakanKhl.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await BonMakanKhl.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdBonMakanKhl(): Promise<number> {
    try {
      const sql = `SELECT ANG_BON_MAKAN_KHL_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
