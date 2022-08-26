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
import { LcInput } from './bi-lc.in';
import { Lc } from './entities/bi-lc';
import { LcView } from './entities/bi-lc.vw';

@Resolver(Lc)
export class LcResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkLcExist(@Arg('id', () => Int) id: number): Promise<boolean> {
    try {
      return (await this.getLc(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [LcView])
  @UseMiddleware(isAuth)
  async getAllLc(): Promise<LcView[] | undefined> {
    try {
      return await Lc.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [LcView], { nullable: true })
  @UseMiddleware(isAuth)
  async getLcByMaster(
    @Arg('imptId', () => Int) imptId: number
  ): Promise<LcView[] | undefined> {
    try {
      return await LcView.findBy({ imptId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => LcView, { nullable: true })
  @UseMiddleware(isAuth)
  async getLc(@Arg('id', () => Int) id: number): Promise<LcView | null> {
    try {
      return await LcView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Lc)
  @UseMiddleware(isAuth)
  async createLc(@Arg('input') input: LcInput): Promise<Lc | undefined> {
    try {
      const existingData = await Lc.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = Lc.create({
        ...input
      });
      const result = await Lc.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Lc, { nullable: true })
  @UseMiddleware(isAuth)
  async updateLc(@Arg('input') input: LcInput): Promise<Lc | undefined> {
    try {
      const data = await Lc.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      Lc.merge(data, { ...input });
      const result = await Lc.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Lc)
  @UseMiddleware(isAuth)
  async deleteLc(@Arg('id', () => Int) id: number): Promise<Lc> {
    try {
      const data = await Lc.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await Lc.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
