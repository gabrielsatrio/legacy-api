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
import { NotulInput } from './bi-notul.in';
import { Notul } from './entities/bi-notul';
import { NotulView } from './entities/bi-notul.vw';

@Resolver(Notul)
export class NotulResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkNotulExist(@Arg('id', () => Int) id: number): Promise<boolean> {
    try {
      return (await this.getNotul(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [NotulView])
  @UseMiddleware(isAuth)
  async getAllNotul(): Promise<NotulView[] | undefined> {
    try {
      return await Notul.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [NotulView], { nullable: true })
  @UseMiddleware(isAuth)
  async getNotulByMaster(
    @Arg('imptId', () => Int) imptId: number
  ): Promise<NotulView[] | undefined> {
    try {
      return await NotulView.findBy({ imptId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => NotulView, { nullable: true })
  @UseMiddleware(isAuth)
  async getNotul(@Arg('id', () => Int) id: number): Promise<NotulView | null> {
    try {
      return await NotulView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Notul)
  @UseMiddleware(isAuth)
  async createNotul(
    @Arg('input') input: NotulInput
  ): Promise<Notul | undefined> {
    try {
      const existingData = await Notul.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = Notul.create({
        ...input
      });
      const result = await Notul.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Notul, { nullable: true })
  @UseMiddleware(isAuth)
  async updateNotul(
    @Arg('input') input: NotulInput
  ): Promise<Notul | undefined> {
    try {
      const data = await Notul.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      Notul.merge(data, { ...input });
      const result = await Notul.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Notul)
  @UseMiddleware(isAuth)
  async deleteNotul(@Arg('id', () => Int) id: number): Promise<Notul> {
    try {
      const data = await Notul.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await Notul.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdNotul(): Promise<number> {
    try {
      const sql = `SELECT ANG_IMPT_NOTUL_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
