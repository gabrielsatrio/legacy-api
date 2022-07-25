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
import { LessThanOrEqual, MoreThan } from 'typeorm';
import { EmployeeMaterializedView } from './entities/employee.mv';
import { MessMember } from './entities/mess-member';
import { MessMemberView } from './entities/mess-member.vw';
import { MessMemberInput } from './mess-member.in';

const formatDate = (date: Date) => {
  function pad(s: any) {
    return s < 10 ? '0' + s : s;
  }
  const d = new Date(date);
  return [pad(d.getMonth() + 1), pad(d.getDate()), d.getFullYear()].join('/');
};
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
      const date = new Date();
      return await MessMemberView.find({
        where: {
          mess: mess,
          validTo: MoreThan(date),
          validFrom: LessThanOrEqual(date)
        },
        order: { isKetua: 'DESC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [MessMemberView])
  @UseMiddleware(isAuth)
  async getMessMembersByTime(
    @Arg('mess', () => String) mess: string,
    @Arg('date', () => Date) date: Date
  ): Promise<MessMemberView[] | undefined> {
    try {
      return await MessMemberView.findBy({
        mess: mess,
        validTo: MoreThan(date),
        validFrom: LessThanOrEqual(date)
      });
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
      const data = await MessMemberView.findOneBy({ mess, isKetua: true });
      return data?.nrp;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [EmployeeMaterializedView])
  @UseMiddleware(isAuth)
  async getEmployeeMVByNRPOrName(
    @Arg('input', () => [String]) input: string[]
  ): Promise<EmployeeMaterializedView[] | undefined> {
    try {
      return await EmployeeMaterializedView.createQueryBuilder('employee')
        .where(
          'employee.employeeId like :employeeId or lower(employee.name) like lower(:name)',
          {
            employeeId: `${input}%`,
            name: `%${input}%`
          }
        )
        .getMany();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => MessMember)
  @UseMiddleware(isAuth)
  async createMessMember(
    @Arg('input') input: MessMemberInput
  ): Promise<MessMember | undefined> {
    try {
      const date = new Date(formatDate(new Date()));
      const exist = await MessMember.findOneBy({
        nrp: input.nrp,
        validTo: MoreThan(date),
        validFrom: LessThanOrEqual(date)
      });
      if (exist) throw new Error('Data already exist');
      const data = MessMember.create({ ...input });
      const result = MessMember.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteMessMember(
    @Arg('id', () => Int) id: number
  ): Promise<boolean | undefined> {
    try {
      const exist = await MessMember.findOneBy({ id });
      if (!exist) throw new Error('Data not exist');
      MessMember.merge(exist, { validTo: new Date(formatDate(new Date())) });
      await MessMember.save(exist);
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
      const date = new Date();
      const valid = await MessMember.findOneBy({
        nrp: nrp,
        mess: mess,
        validTo: MoreThan(date)
      });
      if (valid) {
        const before = await MessMember.findOneBy({
          isKetua: true,
          mess: mess
        });
        if (before) {
          await MessMember.createQueryBuilder()
            .update(MessMember)
            .set({ isKetua: false })
            .where('IS_KETUA = 1 AND MESS = :mess', { mess: mess })
            .execute();
        }
        await MessMember.createQueryBuilder()
          .update(MessMember)
          .set({ isKetua: true })
          .where('MESS = :mess AND NRP = :nrp AND VALID_TO > :date', {
            mess: mess,
            nrp: nrp,
            date: date
          })
          .execute();
      } else throw new Error('Data not exist');
      return true;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
