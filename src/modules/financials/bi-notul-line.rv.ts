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
import { NotulLineInput } from './bi-notul-line.in';
import { NotulLine } from './entities/bi-notul-line';
import { NotulLineView } from './entities/bi-notul-line.vw';

@Resolver(NotulLine)
export class NotulLineResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkNotulLineExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getNotulLine(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [NotulLineView])
  @UseMiddleware(isAuth)
  async getAllNotulLine(): Promise<NotulLineView[] | undefined> {
    try {
      return await NotulLine.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [NotulLineView], { nullable: true })
  @UseMiddleware(isAuth)
  async getNotulLineByMaster(
    @Arg('notulId', () => Int) notulId: number
  ): Promise<NotulLineView[] | undefined> {
    try {
      return await NotulLineView.findBy({ notulId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => NotulLineView, { nullable: true })
  @UseMiddleware(isAuth)
  async getNotulLine(
    @Arg('id', () => Int) id: number
  ): Promise<NotulLineView | null> {
    try {
      return await NotulLineView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => NotulLine)
  @UseMiddleware(isAuth)
  async createNotulLine(
    @Arg('input') input: NotulLineInput
  ): Promise<NotulLine | undefined> {
    try {
      const existingData = await NotulLine.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = NotulLine.create({
        ...input
      });
      const result = await NotulLine.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => NotulLine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateNotulLine(
    @Arg('input') input: NotulLineInput
  ): Promise<NotulLine | undefined> {
    try {
      const data = await NotulLine.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      NotulLine.merge(data, { ...input });
      const result = await NotulLine.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => NotulLine)
  @UseMiddleware(isAuth)
  async deleteNotulLine(@Arg('id', () => Int) id: number): Promise<NotulLine> {
    try {
      const data = await NotulLine.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await NotulLine.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
