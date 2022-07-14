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
import { MessCompanyVisitor } from './entities/mess-company-visitor';
import { MessCompanyVisitorView } from './entities/mess-company-visitor.vw';
import { MessCompanyVisitorInput } from './mess-company-visitor.in';

@Resolver(MessCompanyVisitor)
export class MessCompanyVisitorResolver {
  @Query(() => [MessCompanyVisitorView])
  @UseMiddleware(isAuth)
  async getCompanyVisitors(
    @Arg('id_form', () => Int) id_form: number
  ): Promise<MessCompanyVisitorView[] | undefined> {
    try {
      return await MessCompanyVisitorView.findBy({ id_form: id_form });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Mutation(() => MessCompanyVisitor)
  @UseMiddleware(isAuth)
  async insMessCompanyVisitor(
    @Arg('input') input: MessCompanyVisitorInput
  ): Promise<MessCompanyVisitor | undefined> {
    try {
      const data = MessCompanyVisitor.create({ ...input });
      const result = MessCompanyVisitor.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteMessCompanyVisitor(
    @Arg('id', () => Int) id: number
  ): Promise<boolean | null> {
    try {
      const data = await MessCompanyVisitor.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      MessCompanyVisitor.delete(id);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Mutation(() => MessCompanyVisitor)
  @UseMiddleware(isAuth)
  async updateMessCompanyVisitor(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: MessCompanyVisitorInput
  ): Promise<MessCompanyVisitor | undefined> {
    try {
      const data = await MessCompanyVisitor.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      MessCompanyVisitor.merge(data, { ...input });
      const result = await MessCompanyVisitor.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
