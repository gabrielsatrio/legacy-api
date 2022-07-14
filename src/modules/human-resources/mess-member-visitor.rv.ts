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
import { MessMemberVisitor } from './entities/mess-member-visitor';
import { MessMemberVisitorView } from './entities/mess-member-visitor.vw';
import { MessMemberVisitorInput } from './mess-member-visitor.in';

@Resolver(MessMemberVisitor)
export class MessMemberVisitorResolver {
  @Query(() => [MessMemberVisitorView])
  @UseMiddleware(isAuth)
  async getMemberVisitors(
    @Arg('id_form', () => Int) id_form: number
  ): Promise<MessMemberVisitorView[] | undefined> {
    try {
      return await MessMemberVisitorView.findBy({ id_form: id_form });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Mutation(() => MessMemberVisitor)
  @UseMiddleware(isAuth)
  async insMessMemberVisitor(
    @Arg('input') input: MessMemberVisitorInput
  ): Promise<MessMemberVisitor | undefined> {
    try {
      const data = MessMemberVisitor.create({ ...input });
      const result = MessMemberVisitor.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteMessMemberVisitor(
    @Arg('id', () => Int) id: number
  ): Promise<boolean | null> {
    try {
      const data = await MessMemberVisitor.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      MessMemberVisitor.delete(id);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MessMemberVisitor)
  @UseMiddleware(isAuth)
  async updateMessMemberVisitor(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: MessMemberVisitorInput
  ): Promise<MessMemberVisitor | undefined> {
    try {
      const data = await MessMemberVisitor.findOneBy({ id });
      if (!data) throw new Error('Data not exist');
      MessMemberVisitor.merge(data, { ...input });
      const result = await MessMemberVisitor.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
