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
import { AbsensiKhlInput } from './absensi-khl.in';
import { AbsensiKhl } from './entities/absensi-khl';
import { AbsensiKhlView } from './entities/absensi-khl.vw';

@Resolver(AbsensiKhl)
export class AbsensiKhlResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkAbsensiKhlExist(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    try {
      return (await this.getAbsensiKhl(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AbsensiKhlView])
  @UseMiddleware(isAuth)
  async getAllAbsensiKhl(): Promise<AbsensiKhlView[] | undefined> {
    try {
      return await AbsensiKhl.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => AbsensiKhlView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAbsensiKhl(
    @Arg('id', () => Int) id: number
  ): Promise<AbsensiKhlView | null> {
    try {
      return await AbsensiKhlView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AbsensiKhlView], { nullable: true })
  @UseMiddleware(isAuth)
  async getAbsensiKhlByUser(
    @Arg('createdBy') createdBy: string
  ): Promise<AbsensiKhlView[] | undefined> {
    try {
      return await AbsensiKhlView.findBy({ createdBy });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdAbsensiKhl(): Promise<number> {
    try {
      const sql = `SELECT ANG_EMPLOYEE_KHL_SEQ.NEXTVAL AS "newId" FROM DUAL`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AbsensiKhl)
  @UseMiddleware(isAuth)
  async createAbsensiKhl(
    @Arg('input') input: AbsensiKhlInput
  ): Promise<AbsensiKhl | undefined> {
    try {
      const existingData = await AbsensiKhl.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = AbsensiKhl.create({
        ...input
      });
      const result = await AbsensiKhl.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AbsensiKhl, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAbsensiKhl(
    @Arg('input') input: AbsensiKhlInput
  ): Promise<AbsensiKhl | undefined> {
    try {
      const data = await AbsensiKhl.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      AbsensiKhl.merge(data, { ...input });
      const result = await AbsensiKhl.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => AbsensiKhl)
  @UseMiddleware(isAuth)
  async deleteAbsensiKhl(
    @Arg('id', () => Int) id: number
  ): Promise<AbsensiKhl> {
    try {
      const data = await AbsensiKhl.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await AbsensiKhl.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
