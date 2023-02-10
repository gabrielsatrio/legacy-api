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
import { AngkutanInput } from './angkutan.in';
import { Angkutan } from './entities/angkutan';
import { AngkutanView } from './entities/angkutan.vw';

@Resolver(Angkutan)
export class AngkutanResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkAngkutanExist(@Arg('id', () => Int) id: number): Promise<boolean> {
    try {
      return (await this.getAngkutan(id)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AngkutanView])
  @UseMiddleware(isAuth)
  async getAllAngkutan(): Promise<AngkutanView[] | undefined> {
    try {
      return await Angkutan.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => AngkutanView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAngkutan(
    @Arg('id', () => Int) id: number
  ): Promise<AngkutanView | null> {
    try {
      return await AngkutanView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Angkutan)
  @UseMiddleware(isAuth)
  async createAngkutan(
    @Arg('input') input: AngkutanInput
  ): Promise<Angkutan | undefined> {
    try {
      const existingData = await Angkutan.findOneBy({
        id: input.id
      });
      if (existingData) throw new Error('Data already exists.');
      const data = Angkutan.create({
        ...input
      });
      const result = await Angkutan.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Angkutan, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAngkutan(
    @Arg('input') input: AngkutanInput
  ): Promise<Angkutan | undefined> {
    try {
      const data = await Angkutan.findOneBy({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      Angkutan.merge(data, { ...input });
      const result = await Angkutan.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Angkutan)
  @UseMiddleware(isAuth)
  async deleteAngkutan(@Arg('id', () => Int) id: number): Promise<Angkutan> {
    try {
      const data = await Angkutan.findOneBy({ id });
      if (!data) throw new Error('No data found.');
      await Angkutan.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Int)
  @UseMiddleware(isAuth)
  async getIdAngkutan(): Promise<number> {
    try {
      const sql = `SELECT nvl(max(id), 0) + 1 as "newId" FROM ang_angkutan`;
      const result = await ifs.query(sql);
      return result[0].newId;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => [Angkutan], { nullable: true })
  @UseMiddleware(isAuth)
  async createVoucherAngkutanIfs(
    @Arg('contract') contract: string,
    @Arg('angkutan') angkutan: string,
    @Arg('startDate') startDate: Date,
    @Arg('endDate') endDate: Date,
    @Arg('usernameIfs') usernameIfs: string
  ): Promise<Angkutan[] | null> {
    try {
      const sql = `
    BEGIN
    ang_angkutan_api.upload(
      :contract,
      :angkutan,
      :startDate,
      :endDate,
      :usernameIfs);
    END;
  `;
      await ifs.query(sql, [
        contract,
        angkutan,
        startDate,
        endDate,
        usernameIfs
      ]);

      const data = await Angkutan.findBy({
        contract: contract,
        angkutan: angkutan,
        startDate: startDate,
        endDate: endDate,
        usernameIfs: usernameIfs
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
