import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { Context } from '@/types/context';
import { mapError } from '@/utils/map-error';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { In } from 'typeorm';
import { JadwalEmad } from './entities/jadwal-emad';
import { JadwalEmadInput } from './jadwal-emad.in';

@Resolver(JadwalEmad)
export class JadwalEmadResolver {
  @Query(() => [JadwalEmad], { nullable: true })
  @UseMiddleware(isAuth)
  async getJadwalEmad(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<JadwalEmad[] | undefined> {
    try {
      return await JadwalEmad.findBy({
        contract: In(contract)
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Mutation(() => JadwalEmad)
  @UseMiddleware(isAuth)
  async createJadwalEmad(
    @Arg('input') input: JadwalEmadInput,
    @Ctx() { req }: Context
  ): Promise<JadwalEmad> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_JADWAL_EMAD`;
      const result = await ifs.query(sql);
      const data = JadwalEmad.create({
        ...input,
        createdBy: req.session.username,
        createdAt: new Date(),
        id: result[0].id
      });
      const results = await JadwalEmad.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => JadwalEmad, { nullable: true })
  @UseMiddleware(isAuth)
  async updateJadwalEmad(
    @Arg('input') input: JadwalEmadInput
  ): Promise<JadwalEmad> {
    try {
      const data = await JadwalEmad.findOneBy({
        id: input.id,
        contract: input.contract
      });
      if (!data) throw new Error('No data found.');
      JadwalEmad.merge(data, { ...input });
      const results = await JadwalEmad.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => JadwalEmad)
  @UseMiddleware(isAuth)
  async deleteJadwalEmad(
    @Arg('id') id: number,
    @Arg('contract') contract: string
  ): Promise<JadwalEmad> {
    try {
      const data = await JadwalEmad.findOneBy({
        id,
        contract
      });
      if (!data) throw new Error('No data found.');
      await JadwalEmad.delete({ id, contract });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
