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
import { ImportBookParamInput } from './bi-import-book-param.in';
import { ImportBookParam } from './entities/bi-import-book-param';
import { ImportBookParamView } from './entities/bi-import-book-param.vw';

@Resolver(ImportBookParam)
export class ImportBookParamResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkImportBookParamExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getImportBookParam(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ImportBookParamView])
  @UseMiddleware(isAuth)
  async getAllImportBookParam(): Promise<ImportBookParamView[] | undefined> {
    try {
      return await ImportBookParam.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => ImportBookParamView, { nullable: true })
  @UseMiddleware(isAuth)
  async getImportBookParam(
    @Arg('id', () => Int) id: number
  ): Promise<ImportBookParamView | null> {
    try {
      return await ImportBookParamView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImportBookParam)
  @UseMiddleware(isAuth)
  async createImportBookParam(
    @Arg('input') input: ImportBookParamInput
  ): Promise<ImportBookParam | undefined> {
    try {
      const existingData = await ImportBookParam.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = ImportBookParam.create({
        ...input
      });
      const result = await ImportBookParam.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImportBookParam, { nullable: true })
  @UseMiddleware(isAuth)
  async updateImportBookParam(
    @Arg('input') input: ImportBookParamInput
  ): Promise<ImportBookParam | undefined> {
    try {
      const data = await ImportBookParam.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      ImportBookParam.merge(data, { ...input });
      const result = await ImportBookParam.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImportBookParam)
  @UseMiddleware(isAuth)
  async deleteImportBookParam(
    @Arg('id', () => Int) id: number
  ): Promise<ImportBookParam> {
    try {
      const data = await ImportBookParam.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await ImportBookParam.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdBonMakanWeekdays(): Promise<number> {
    try {
      const sql = `SELECT ANG_IMPORT_BOOK_PARAM_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
