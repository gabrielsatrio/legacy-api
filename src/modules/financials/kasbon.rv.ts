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
import { Kasbon } from './entities/kasbon';
import { KasbonView } from './entities/kasbon.vw';
import { KasbonInput } from './kasbon.in';

@Resolver(Kasbon)
export class KasbonResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkKasbonExist(@Arg('id', () => Int) id: number): Promise<boolean> {
    try {
      return (await this.getKasbon(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [KasbonView])
  @UseMiddleware(isAuth)
  async getAllKasbon(): Promise<KasbonView[] | undefined> {
    try {
      return await Kasbon.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => KasbonView, { nullable: true })
  @UseMiddleware(isAuth)
  async getKasbon(
    @Arg('id', () => Int) id: number
  ): Promise<KasbonView | null> {
    try {
      return await KasbonView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Kasbon)
  @UseMiddleware(isAuth)
  async createKasbon(
    @Arg('input') input: KasbonInput
  ): Promise<Kasbon | undefined> {
    try {
      const existingData = await Kasbon.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = Kasbon.create({
        ...input
      });
      const result = await Kasbon.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Kasbon, { nullable: true })
  @UseMiddleware(isAuth)
  async updateKasbon(
    @Arg('input') input: KasbonInput
  ): Promise<Kasbon | undefined> {
    try {
      const data = await Kasbon.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      Kasbon.merge(data, { ...input });
      const result = await Kasbon.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Kasbon)
  @UseMiddleware(isAuth)
  async deleteKasbon(@Arg('id', () => Int) id: number): Promise<Kasbon> {
    try {
      const data = await Kasbon.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await Kasbon.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdKasbon(): Promise<number> {
    try {
      const sql = `SELECT ANG_KASBON_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
