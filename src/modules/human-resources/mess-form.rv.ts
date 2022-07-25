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
import { MessForm } from './entities/mess-form';
import { MessFormView } from './entities/mess-form.vw';
import { MessFormInput } from './mess-form.in';

@Resolver(MessForm)
export class MessFormResolver {
  @Query(() => [MessFormView])
  @UseMiddleware(isAuth)
  async getAllMessForm(): Promise<MessFormView[] | undefined> {
    try {
      return await MessFormView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => MessFormView)
  @UseMiddleware(isAuth)
  async getMessForm(
    @Arg('id', () => Int) id: number
  ): Promise<MessFormView | null> {
    try {
      return await MessFormView.findOneBy({ id });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MessForm)
  @UseMiddleware(isAuth)
  async createMessBill(
    @Arg('input') input: MessFormInput
  ): Promise<MessForm | undefined> {
    try {
      const exist = await MessForm.findOneBy({
        tanggalTagihan: input.tanggalTagihan
      });
      if (exist) throw Error('Data already exist for this month');
      const data = MessForm.create({ ...input });
      const result = await MessForm.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MessForm)
  @UseMiddleware(isAuth)
  async updateMessBill(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: MessFormInput
  ): Promise<MessForm | undefined> {
    try {
      const data = await MessForm.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      MessForm.merge(data, { ...input });
      const result = await MessForm.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteBill(
    @Arg('id', () => Int) id: number
  ): Promise<boolean | undefined> {
    try {
      const data = await MessForm.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      await MessForm.delete({ id });
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
