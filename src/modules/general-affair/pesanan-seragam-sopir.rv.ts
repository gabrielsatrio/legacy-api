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
import { SopirDireksi } from './entities/pesanan-seragam-sopir';
import { SopirDireksiView } from './entities/pesanan-seragam-sopir.vw';

@Resolver(SopirDireksi)
export class SopirDireksiResolver {
  @Query(() => [SopirDireksiView])
  @UseMiddleware(isAuth)
  async getAllSopirDireksi(): Promise<SopirDireksiView[] | undefined> {
    try {
      return await SopirDireksiView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SopirDireksi)
  @UseMiddleware(isAuth)
  async createSopirDireksi(
    @Arg('id', () => Int) id: number,
    @Arg('employeeId', () => String) employeeId: string
  ): Promise<SopirDireksi | undefined> {
    try {
      const exist = await SopirDireksi.findOneBy({ employeeId });
      if (exist) throw new Error('Data already exist');
      const result = SopirDireksi.create({ id, employeeId });
      await SopirDireksi.save(result);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteSopirDireksi(
    @Arg('id', () => Int) id: number
  ): Promise<boolean | undefined> {
    try {
      const data = await SopirDireksi.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      await SopirDireksi.delete({ id });
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
