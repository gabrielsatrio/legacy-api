import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { InsMessMember } from './entities/mess-ins-member';
import { MessMember } from './entities/mess-member';
import { MessMemberView } from './entities/mess-member.vw';
import { InsMessMemberInput } from './mess-ins-member.in';

@Resolver(MessMember)
export class MessMemberResolver {
  @Query(() => [MessMemberView])
  @UseMiddleware(isAuth)
  async getAllMessMember(): Promise<MessMemberView[] | undefined> {
    try {
      return await MessMemberView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Query(() => [MessMemberView])
  @UseMiddleware(isAuth)
  async getMessMembers(
    @Arg('mess', () => String) mess: string
  ): Promise<MessMemberView[] | undefined> {
    try {
      return await MessMemberView.findBy({ mess });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Query(() => String)
  @UseMiddleware(isAuth)
  async getMessHead(
    @Arg('mess', () => String) mess: string
  ): Promise<string | undefined> {
    try {
      const data = await MessMemberView.findOneBy({ mess, is_ketua: 1 });
      return data?.nrp;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Mutation(() => InsMessMember)
  @UseMiddleware(isAuth)
  async insertMessMember(
    @Arg('input') input: InsMessMemberInput
  ): Promise<InsMessMember | undefined> {
    try {
      const exist = await InsMessMember.findOneBy({ nrp: input.nrp });
      if (exist) throw new Error('Data already exist');
      const data = InsMessMember.create({ ...input });
      const result = InsMessMember.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteMessMember(
    @Arg('nrp', () => String) nrp: string
  ): Promise<boolean | undefined> {
    try {
      const data = await InsMessMember.findOneBy({ nrp });
      if (!data) throw new Error('Data not exist');
      InsMessMember.delete(nrp);
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async changeKetua(
    @Arg('nrp', () => String) nrp: string,
    @Arg('mess', () => String) mess: string
  ): Promise<boolean | undefined> {
    try {
      const valid = await MessMember.findOneBy({ nrp: nrp, mess: mess });
      if (valid) {
        const before = await MessMember.findOneBy({ is_ketua: 1, mess: mess });
        if (before) {
          await MessMember.createQueryBuilder()
            .update(MessMember)
            .set({ is_ketua: 0 })
            .where('IS_KETUA = 1 AND MESS = :mess', { mess: mess })
            .execute();
        }
        await MessMember.createQueryBuilder()
          .update(MessMember)
          .set({ is_ketua: 1 })
          .where('MESS = :mess AND NRP = :nrp', { mess: mess, nrp: nrp })
          .execute();
      } else throw new Error('Data not exist');
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
