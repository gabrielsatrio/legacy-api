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
import { ImportExpedition } from './entities/import-expedition';
import { ImportExpeditionView } from './entities/import-expedition.vw';
import { ImportExpeditionInput } from './import-expedition.in';

@Resolver(ImportExpedition)
export class ImportExpeditionResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkImportExpeditionExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getImportExpedition(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ImportExpeditionView])
  @UseMiddleware(isAuth)
  async getAllImportExpedition(): Promise<ImportExpeditionView[] | undefined> {
    try {
      return await ImportExpedition.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => ImportExpeditionView, { nullable: true })
  @UseMiddleware(isAuth)
  async getImportExpedition(
    @Arg('id', () => Int) id: number
  ): Promise<ImportExpeditionView | null> {
    try {
      return await ImportExpeditionView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImportExpedition)
  @UseMiddleware(isAuth)
  async createImportExpedition(
    @Arg('input') input: ImportExpeditionInput
  ): Promise<ImportExpedition | undefined> {
    try {
      const existingData = await ImportExpedition.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = ImportExpedition.create({
        ...input
      });
      const result = await ImportExpedition.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImportExpedition, { nullable: true })
  @UseMiddleware(isAuth)
  async updateImportExpedition(
    @Arg('input') input: ImportExpeditionInput
  ): Promise<ImportExpedition | undefined> {
    try {
      const data = await ImportExpedition.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      ImportExpedition.merge(data, { ...input });
      const result = await ImportExpedition.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImportExpedition)
  @UseMiddleware(isAuth)
  async deleteImportExpedition(
    @Arg('id', () => Int) id: number
  ): Promise<ImportExpedition> {
    try {
      const data = await ImportExpedition.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await ImportExpedition.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
