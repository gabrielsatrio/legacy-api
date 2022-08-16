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
import { ImportBookInput } from './bi-import-book.in';
import { ImportBook } from './entities/bi-import-book';
import { ImportBookView } from './entities/bi-import-book.vw';

@Resolver(ImportBook)
export class ImportBookResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkImportBookExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getImportBook(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ImportBookView])
  @UseMiddleware(isAuth)
  async getAllImportBook(): Promise<ImportBookView[] | undefined> {
    try {
      return await ImportBook.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ImportBookView], { nullable: true })
  @UseMiddleware(isAuth)
  async getImportBookByMaster(
    @Arg('imptId', () => Int) imptId: number
  ): Promise<ImportBookView[] | undefined> {
    try {
      return await ImportBookView.findBy({ imptId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => ImportBookView, { nullable: true })
  @UseMiddleware(isAuth)
  async getImportBook(
    @Arg('id', () => Int) id: number
  ): Promise<ImportBookView | null> {
    try {
      return await ImportBookView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImportBook)
  @UseMiddleware(isAuth)
  async createImportBook(
    @Arg('input') input: ImportBookInput
  ): Promise<ImportBook | undefined> {
    try {
      const existingData = await ImportBook.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = ImportBook.create({
        ...input
      });
      const result = await ImportBook.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImportBook, { nullable: true })
  @UseMiddleware(isAuth)
  async updateImportBook(
    @Arg('input') input: ImportBookInput
  ): Promise<ImportBook | undefined> {
    try {
      const data = await ImportBook.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      ImportBook.merge(data, { ...input });
      const result = await ImportBook.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImportBook)
  @UseMiddleware(isAuth)
  async deleteImportBook(
    @Arg('id', () => Int) id: number
  ): Promise<ImportBook> {
    try {
      const data = await ImportBook.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await ImportBook.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdImportBook(): Promise<number> {
    try {
      const sql = `SELECT ANG_IMPORT_BOOK_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
